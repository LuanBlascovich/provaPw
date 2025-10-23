import * as repo from "../repository/usuarioRepository.js";
import { generateToken, getAuthentication } from "../utils/jwt.js";
import { Router } from "express";
const endpoints = Router();
const autenticar = getAuthentication();
const gerarToken = generateToken();

endpoints.post("/usuario/cadastrar", async (req, resp) => {
  const usuario = req.body;
  const novoId = await repo.cadastro(usuario);
  resp.send({ novoId: novoId });
});

endpoints.post("/usuario/login", async (req, resp) => {
  const usuario = req.body;
  const credenciais = await repo.login(usuario.email, usuario.senha);
  if (!credenciais) {
    resp.status(404).send({ Erro: "E-mail ou senha inválidos" });
  }
  const token = gerarToken(credenciais);
  resp.send({ token: token });
});

endpoints.put("/usuarios/alterar/:id", async (req, resp) => {
  const usuario = req.body;
  const id = req.params.id;
  const linhasAfetadas = await repo.alterar(id, usuario);
  if (linhasAfetadas == 0) {
    resp.status(404).send({ Erro: "Usuário não encontrado" });
  }
  resp.send({ linhasAfetadas: linhasAfetadas });
});

endpoints.delete("/usuario/:id", async (req, resp) => {
  const id = req.params.id;
  const linhasAfetadas = await repo.excluir(id);
  if (linhasAfetadas == 0) {
    resp.status(404).send({ Erro: "Usuário não encontrado" });
  }
  resp.send({ linhasAfetadas: linhasAfetadas });
});

endpoints.get("/usuario/listar", async (req, resp) => {
  const usuarios = await repo.listar();
  resp.send({ usuarios: usuarios });
});

endpoints.get("/usuario/buscar/:id", async (req, resp) => {
  const id = req.params.id;
  const usuario = await repo.buscar(id);
  if (!usuario) {
    resp.status.send({ Erro: "Usuário não encontrado" });
  }
  resp.send({ usuario: usuario });
});

export default endpoints;
