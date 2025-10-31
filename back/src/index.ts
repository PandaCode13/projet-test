import connectDB from '#config/db.js';
import { env } from '#config/index.js';
import { User } from '#models/user.model.js';
import authRouter from '#routes/auth.routes.js'
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

const app: Express = express();

const PORT = env.PORT;

app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(express.json());


app.get('/users',async (_req, res)=>{
  const users = await User.find().select('-password');
  res.status(200).json(users);
})

// Routers
app.use('/auth', authRouter)
const server = app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('SIGINT: Shutting down server...');
  server.close();
  process.exit();
});
process.on('SIGTERM', () => {
  console.log('SIGTERM: Shutting down server...');
  server.close();
  process.exit();
});
