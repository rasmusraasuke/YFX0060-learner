import express, { Express } from 'express';
import cors from 'cors';
import path from 'path';
import flashcardRoutes from './routes/flashcards';

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api', flashcardRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});