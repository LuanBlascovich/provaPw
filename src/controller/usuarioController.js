import * as repo from "../repository/usuarioRepository.js";
import { generateToken, getAuthentication } from "../utils/jwt.js";
import { Router } from "express";

const endpoints = Router();
const autenticar = getAuthentication();
const gerarToken = generateToken;

endpoints.post("/usuario/cadastrar", async (req, resp) => {
  const usuario = req.body;
  const novoId = await repo.cadastro(usuario);
  resp.send({ novoId });
});

endpoints.post("/usuario/login", async (req, resp) => {
  const usuario = req.body;
  const credenciais = await repo.login(usuario.email, usuario.senha);
  if (!credenciais) {
    return resp.status(404).send({ Erro: "E-mail ou senha inválidos" });
  }
  const token = gerarToken(credenciais);
  resp.send({ token });
});

endpoints.put("/usuario/:id", autenticar, async (req, resp) => {
  const usuarioLogadoId = req.user.id;
  const id = req.params.id;
  if (usuarioLogadoId != id) {
    return resp.status(401).send({ Erro: "Você não possui permissão para realizar essa ação" });
  }
  const usuario = req.body;
  const linhasAfetadas = await repo.alterar(id, usuario);
  if (linhasAfetadas === 0) {
    return resp.status(404).send({ Erro: "Usuário não encontrado" });
  }
  resp.send({ linhasAfetadas });
});

endpoints.delete("/usuario/:id", autenticar, async (req, resp) => {
  const usuarioLogadoId = req.user.id;
  const id = req.params.id;
  if (usuarioLogadoId != id) {
    return resp.status(401).send({ Erro: "Você não possui permissão para realizar essa ação" });
  }
  const linhasAfetadas = await repo.excluir(id);
  if (linhasAfetadas === 0) {
    return resp.status(404).send({ Erro: "Usuário não encontrado" });
  }
  resp.send({ linhasAfetadas });
});

endpoints.get("/usuario/listar", autenticar, async (req, resp) => {
  const usuarios = await repo.listar();
  resp.send({ usuarios });
});

endpoints.get("/usuario/buscar/:id", autenticar, async (req, resp) => {
  const id = req.params.id;
  const usuario = await repo.buscar(id);
  if (!usuario) {
    return resp.status(404).send({ Erro: "Usuário não encontrado" });
  }
  resp.send({ usuario });
});

export default endpoints;
