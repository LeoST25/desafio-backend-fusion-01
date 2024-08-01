import express from 'express';
import bodyParser from 'body-parser';
import planetRoutes from './routes/planetRoutes';
import starSystemRoutes from './routes/starSystemRoutes';
import characterRoutes from './routes/characterRoutes';
import spaceshipRoutes from './routes/spaceshipRoutes';
import connectDB from './database';
import authRoutes from './routes/authRoutes';
import protectedRoutes from './routes/protectedRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/planets', planetRoutes);
app.use('/api/star-systems', starSystemRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/spaceships', spaceshipRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
