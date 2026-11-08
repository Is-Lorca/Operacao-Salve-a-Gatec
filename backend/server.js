// para carregar o .env
require("dotenv").config();

// Aqui estamos fazendo a ligação do server, utilizando a biblioteca Express para facilitar 
// a manipulação do código.
// Além de fazer a ligação do server, esse arquivo tambem importa as rotas 
// (para onde e como serão direcionadas as requisições e respostas)

// Importando as bibliotecas necessárias
const express = require("express");
const cors = require('cors'); // importando o pacote cors para não ocorrer erro de mesmo nome
const app = express();
const PORT = 3000;

// configurações do Express:
// ativando o cors em todas as origens (para facilitar)
app.use(cors());
app.use(express.json());

// chamamos as rotas para o server
const materiaRoutes = require('./src/routes/materiasRoutes');
const savesRoutes = require('./src/routes/savesRoutes');
app.use('/api/materias', materiaRoutes);
app.use('/api/saves', savesRoutes);

// app.get() apenas registra que uma rota existe, não faz a requisição, so quando alguem acessa
app.get('/api', (req, res) => {
    res.send('Pagina inicial, simples assim')
}); 

app.listen(PORT, () => {
    console.log(`Servidor Express rodando na porta ${PORT}`);
});

// Para rodar, escreva no terminal: node .\server.js
// abra um navegador e escreva localhost:{numero da porta}, no caso, localhost:3000
// para desligar, basta "kill terminal"