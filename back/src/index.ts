import { envConfig } from '#config/index.js';
import express, { Express } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

const app: Express = express();

const PORT = envConfig.port || 3000;


app.use(morgan(envConfig.nodeEnv === 'development' ? 'dev' : 'combined'));
app.use(helmet())
app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ message: 'API is running' });
});

const server = app.listen(PORT, () => {
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