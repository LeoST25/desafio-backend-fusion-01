import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI não encontrada nas variáveis de ambiente');
    }

    console.log('Tentando conectar ao MongoDB...');
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000, // Timeout após 10 segundos se não conseguir conectar
      socketTimeoutMS: 45000, // Fechar sockets após 45 segundos de inatividade
      maxPoolSize: 10, // Manter até 10 conexões de socket
    });
    
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err);
    
    // Fornecer dicas de solução baseadas no tipo de erro
    const errorMessage = err instanceof Error ? err.message : String(err);
    if (errorMessage.includes('ENOTFOUND') || errorMessage.includes('querySrv')) {
      console.log('💡 Dica: Problema de DNS. Verifique:');
      console.log('   - Sua conexão com a internet');
      console.log('   - Se o cluster do MongoDB Atlas está ativo');
      console.log('   - Se as credenciais estão corretas');
    }
    
    // Não sair do processo para permitir desenvolvimento local
    console.log('⚠️  Continuando sem banco de dados...');
  }
};

export default connectDB;
