// D:\SITES\CapitalDaark-new\backend\index.js

require('dotenv').config(); // Carrega as variáveis de ambiente

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000; // Use a porta 5000 para o backend

// Middlewares
app.use(express.json()); // Habilita o uso de JSON no corpo das requisições
app.use(cors()); // Permite requisições de outras origens (seu frontend)

// Conexão com o banco de dados MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado ao MongoDB!'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Rotas de teste
app.get('/', (req, res) => {
  res.send('Servidor do Capital Daark está online!');
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});