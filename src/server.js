import express from 'express';

import movieRoutes from './routes/movieRoutes.js';

const app = express();

const PORT = 5001;

app.use('/movies', movieRoutes);

app.get('/hello', (req, res) => {
    res.json({ message: 'Hello, Worlds!' });
});

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

