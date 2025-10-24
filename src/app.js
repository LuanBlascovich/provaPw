import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';

import { adicionarRotas } from './rotas.js';

const api = express();
api.use(cors());
api.use(express.json());

adicionarRotas(api);

const PORT = process.env.PORT;

const laranja = "\x1b[38;5;208m";
const resetCor = "\x1b[0m";

api.listen(PORT, () => {
  console.log(`${laranja}...: API subiu na porta ${PORT} :...${resetCor}`);
});