const express = require('express');

const server = express();

server.use(express.json());

/**
 * Query params = ?teste=1
 * Route params = /users/1
 * Request body = { "name": "Adriano", "email": "adriano@projectaweb.com.br" }
 */

 /**
  * C - Create
  * R - Read
  * U - Update
  * D - Delete
  */

const users = ['Adriano', 'Fulano', 'Francisco'];

// middleware globais
server.use((req, res, next) => {
  console.log('A requisição foi chamada!');

  return next();
});
// middleware de Logs. Saber qual método e url foi chamada
server.use((req, res, next) => {
  console.log(`Método: ${req.method}; URL: ${req.url}`);

  return next();
});
// middleware de Logs. Saber qual método e url foi chamada e quanto tempo o método demora para retorno
server.use((req, res, next) => {
  console.time('Request');
  console.time(`Método: ${req.method}; URL: ${req.url}`);

  next();

  console.timeEnd('Request');
});

// middleware locais. verifica se o usuário mandou alguma informação
// Usado no POST e PUT
function checkUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: 'User name is required' });
  }

  return next();
};
// middleware que verifica se um usuário existe. para os HTTP GET, PUT e DELETE
function checkUserInArray(req, res, next) {
  const user = users[req.params.index];

  if (!user) {
    return res.status(400).json({ error: 'User does not exists' });
  }

  req.user = user;

  return next();
}

// Rota que Lista todos os usuários
server.get('/users', (req, res) => {
  return res.json(users);
});
// Rota de listar um usuário
server.get('/users/:index', checkUserInArray, (req, res) =>{
  return res.json(req.user);
});

// Rota de criação de usuário
server.post('/users', checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

// Rota de atualização/auteração de usuário
server.put('/users/:index', checkUserExists, checkUserInArray, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
});

// Deletar um usuário
server.delete('/users/:index', checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  //return res.json(users);
  return res.send();
})

server.listen(3000);