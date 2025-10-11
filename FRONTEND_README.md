# Star Wars API - Frontend

## 🚀 Visão Geral

Este é o frontend da API Star Wars, uma aplicação React moderna com autenticação via AWS Cognito e interface para gerenciamento de planetas, personagens, naves espaciais e sistemas estelares.

## ✨ Funcionalidades Principais

### 🔐 Autenticação
- **Login via AWS Cognito**: Interface integrada com o sistema de autenticação do AWS Cognito
- **Registro de Usuários**: Criação de contas com diferentes afiliações (Jedi, Sith, Rebelião, Império, Neutro)
- **Confirmação de Email**: Processo de verificação com código de 6 dígitos
- **Persistência de Sessão**: Mantém o usuário logado entre sessões

### 🌍 Gerenciamento de Planetas
- **CRUD Completo**: Criar, visualizar, editar e excluir planetas
- **Filtros Avançados**: Busca por nome e filtro por clima
- **Interface Intuitiva**: Cards com informações detalhadas e ações rápidas
- **Validação de Dados**: Formulários com validação em tempo real

### 🎨 Interface de Usuário
- **Design Star Wars**: Tema escuro com elementos visuais da saga
- **Responsivo**: Adaptável para desktop, tablet e mobile
- **Sidebar Navegável**: Menu lateral com diferentes seções
- **Animações**: Transições suaves e efeitos visuais

## 🛠️ Tecnologias Utilizadas

- **React 18**: Framework principal para a interface
- **Vite**: Build tool rápida e moderna
- **React Router**: Navegação e roteamento
- **Axios**: Cliente HTTP para comunicação com a API
- **Tailwind CSS**: Framework CSS para estilização
- **Lucide React**: Biblioteca de ícones moderna
- **Headless UI**: Componentes acessíveis sem estilo

## 📁 Estrutura do Projeto

```
frontend/
├── src/
│   ├── components/
│   │   ├── Login.jsx           # Tela de login/registro/confirmação
│   │   ├── Dashboard.jsx       # Dashboard principal com sidebar
│   │   └── PlanetManager.jsx   # Gerenciamento de planetas
│   ├── contexts/
│   │   └── AuthContext.jsx     # Context para estado de autenticação
│   ├── services/
│   │   └── api.js             # Cliente API e serviços
│   ├── App.jsx                # Componente raiz com rotas
│   ├── App.css               # Estilos globais
│   ├── index.css             # Estilos base com Tailwind
│   └── main.jsx              # Ponto de entrada da aplicação
├── public/
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## 🔑 Componentes Principais

### Login Component
- Interface de 3 abas: Login, Registro, Confirmação
- Validação de formulários
- Integração com AWS Cognito
- Seleção de afiliação com ícones temáticos
- Estados de loading e mensagens de erro/sucesso

### Dashboard Component
- Layout responsivo com sidebar
- Menu de navegação entre seções
- Informações do usuário logado
- Sistema de logout
- Placeholders para funcionalidades futuras

### PlanetManager Component
- Lista de planetas em cards
- Formulário modal para criar/editar
- Sistema de busca e filtros
- Ações CRUD com confirmações
- Indicadores visuais para diferentes climas

### AuthContext
- Gerenciamento de estado global de autenticação
- Interceptadores para requisições HTTP
- Persistência do token no localStorage
- Funções de login, registro e logout

## 🌐 API Integration

O frontend se conecta com a API backend através do serviço `api.js`:

- **Base URL**: `http://localhost:3000/api`
- **Autenticação**: JWT via AWS Cognito
- **Interceptadores**: Automática injeção de tokens e refresh
- **Error Handling**: Tratamento de erros e redirecionamentos

## 🚀 Como Executar

1. **Navegar para a pasta do frontend**:
   ```bash
   cd frontend
   ```

2. **Instalar dependências**:
   ```bash
   npm install
   ```

3. **Executar o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

4. **Acessar a aplicação**:
   - Frontend: `http://localhost:5173`
   - Backend deve estar rodando em: `http://localhost:3000`

## 📱 Telas e Fluxos

### Fluxo de Autenticação
1. **Tela de Login**: Usuário insere email e senha
2. **Registro**: Novo usuário cria conta com afiliação
3. **Confirmação**: Verificação via código enviado por email
4. **Dashboard**: Acesso ao painel principal após autenticação

### Gerenciamento de Planetas
1. **Visualização**: Lista de todos os planetas em cards
2. **Busca**: Filtro por nome em tempo real
3. **Filtro**: Seleção por tipo de clima
4. **Criação**: Modal com formulário para novo planeta
5. **Edição**: Modal pré-preenchido para alterações
6. **Exclusão**: Confirmação antes da remoção

## 🎯 Funcionalidades Futuras

- **Personagens**: CRUD completo para personagens
- **Naves Espaciais**: Gerenciamento de frotas
- **Sistemas Estelares**: Mapeamento galáctico
- **Relatórios**: Dashboard com estatísticas
- **Busca Avançada**: Filtros múltiplos e ordenação
- **Upload de Imagens**: Avatares e fotos dos itens

## 🔒 Segurança

- Rotas protegidas com verificação de autenticação
- Tokens JWT com expiração automática
- Validação client-side e server-side
- Logout automático em caso de token inválido
- Headers de segurança nas requisições

## 🎨 Design System

- **Cores**: Paleta escura com acentos azuis/roxos
- **Tipografia**: Inter como fonte principal
- **Espaçamento**: Sistema baseado em Tailwind (4px, 8px, 16px, etc.)
- **Componentes**: Consistência visual em botões, inputs e cards
- **Ícones**: Lucide React para iconografia moderna
- **Responsividade**: Mobile-first approach

## 📝 Notas Importantes

- O frontend depende do backend estar executando na porta 3000
- AWS Cognito deve estar configurado no backend para autenticação completa
- Tailwind CSS pode apresentar avisos sobre diretivas @tailwind no editor
- A aplicação utiliza localStorage para persistência do token
- Todas as rotas são client-side, exceto as chamadas à API

---

**Que a Força esteja com você!** ⚡