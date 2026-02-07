import express from 'express';
import { config } from 'dotenv';
import { connectDB, disconnectDB } from './config/db.js';

import movieRoutes from './routes/movieRoutes.js';
import authRoutes from './routes/authRoutes.js';

config();
connectDB();

const app = express();

//Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT;

//API routes
app.use('/movies', movieRoutes);
app.use('/auth', authRoutes);

app.get('/hello', (req, res) => {
    res.json({ message: 'Hello, Worlds!' });
});

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    server.close(async () => {
        await disconnectDB();
        process.exit(1);
    });
});

process.on('uncaughtException', async (err) => {
    console.error('Uncaught Exception:', err);
    await disconnectDB();
    process.exit(1);
});

process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully...');
    server.close(async () => {
        await disconnectDB();
        process.exit(0);
    });
});