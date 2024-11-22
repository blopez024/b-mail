import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// Middleware
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello, TypeScript!');
});

export { app };
