import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

app.get('/api/product', (_req, res) => {
  res.json({
    brand: 'KAJA',
    title: 'A product presentation experience',
    description: 'Controlled scroll, cinematic product reveals and an elastic custom cursor.',
    sections: 6
  });
});

const clientDist = path.resolve(__dirname, '../client/dist');
app.use(express.static(clientDist));

app.use((req, res) => {
  res.sendFile(path.join(clientDistPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`KAJA server running on http://localhost:${PORT}`);
});
