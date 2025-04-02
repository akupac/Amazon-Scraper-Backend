import router from './routes/routes.js'
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

const env = dotenv.config('./.env').parsed;

const corsOptions = {
  origin: env.VITE_API_URL || 'http://localhost:5173',
  allowedHeaders: ['Content-Type'],
  methods: ['GET'],
};
const app = express(); 
const PORT = env.API_PORT || 3000; 

app.use(cors(corsOptions));
app.use('/', router);
app.use('/scrape', router);

app.listen(PORT, () => { 
  console.log(`API is listening on port ${PORT}`); 
});

