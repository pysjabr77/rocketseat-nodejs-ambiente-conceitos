const express = require("express");

const server = express();
server.use(express.json());

let users = ["Pedro", "Joao", "Maria"];

//Query params = ?teste=1
//Route params = /users/1
//Request body = { name: "Pedro", email: "pedro.yoda@gmail.com"}

//CRUD - Create, Read, Update e Delete

//Middleware Global
server.use((req, res, next) => {
  console.time("Request");
  console.log(`Metodo? ${req.method}; URL: ${req.url}`);

  next();

  console.timeEnd("Request");
});

server.get("/users", (req, res) => {
  // return res.send("Hello, nodejs ambiente e conceitos");
  //return res.send({ message: "Hello, nodejs ambiente e conceitos" });

  //query params
  //url: http://localhost:3000/users?nome=Pedro
  // const nome = req.query.nome;
  // return res.send(`Hello ${nome}, nodejs ambiente e conceitos`);

  return res.json(users);
});

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];

  if (!user) {
    return res.status(400).json({ error: "User does not exists" });
  }

  req.user = user;

  return next();
}

server.get("/users/:index", checkUserInArray, (req, res) => {
  //route params
  //url: http://localhost:3000/users/123456
  // const { index } = req.params;
  // return res.send(`Hello, usuário ${users[index]}`);

  //ou
  //Porque o middleware checkUserInArray ja verificou e adicionou o user no req
  return res.json(req.user);
});

function checkUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "User name is required" });
  }
  return next();
}

server.post("/users", checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

server.put("/users/:index", checkUserExists, checkUserInArray, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
});

server.delete("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.json();
});

server.listen("3000");
