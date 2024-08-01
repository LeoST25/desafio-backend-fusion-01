import express from 'express';
import planetRoutes from './routes/planetRoutes';
import starSystemRoutes from './routes/starSystemRoutes';
import characterRoutes from './routes/characterRoutes';
import spaceshipRoutes from './routes/spaceshipRoutes';
import connectDB from './database';

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/planets', planetRoutes);
app.use('/api/star-systems', starSystemRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/spaceships', spaceshipRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
