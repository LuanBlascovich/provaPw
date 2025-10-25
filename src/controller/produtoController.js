import multer from "multer";
import { Router } from "express";
import * as repo from "../repository/produtoRepository.js";
import { getAuthentication } from "../utils/jwt.js";

const upload = multer({ dest: "public/storage" });
const endpoints = Router();
const autenticar = getAuthentication();

endpoints.post("/produto/postar", autenticar, upload.single("imagem"), async (req, resp) => {
  const idUsuarioLogado = req.user.id;
  const caminhoImagem = req.file.path;
  const produto = req.body;
  const novoId = await repo.postarProd(idUsuarioLogado, produto, caminhoImagem);
  resp.send({ novoId: novoId });
});

endpoints.put("/produto/alterar/:idProduto", autenticar, upload.single("imagem"), async (req, resp) => {
  const idUsuarioLogado = req.user.id;
  const idProduto = req.params.idProduto;

  const verificacao = await repo.verificacaoDono(idUsuarioLogado, idProduto);
  if (verificacao == null) {
    return resp.status(401).send({ Erro: "Você não possui autorização para realizar essa ação ou o produto não foi encontrado" });
  }

  const produto = req.body;
  const caminhoImagem = req.file.path;
  const registrosAfetados = await repo.alterarProd(idProduto, produto, caminhoImagem);
  resp.send({ registrosAfetados: registrosAfetados });
});

endpoints.delete("/produto/deletar/:idProduto", autenticar, async (req, resp) => {
  const idUsuarioLogado = req.user.id;
  const idProduto = req.params.idProduto;

  const verificacao = await repo.verificacaoDono(idUsuarioLogado, idProduto);
  if (verificacao == null) {
    return resp.status(401).send({ Erro: "Você não possui autorização para realizar essa ação ou o produto não foi encontrado" });
  }

  const registrosAfetados = await repo.deletarProd(idProduto);
  resp.send({ registrosAfetados: registrosAfetados });
});

endpoints.get("/produto/listar/:idUsuario", autenticar, async (req, resp) => {
  const idUsuario = req.params.idUsuario;
  const produtos = await repo.listarProdutosUsuario(idUsuario);
  resp.send({ produtos });
});

endpoints.get("/produto/listar", autenticar, async (req, resp) => {
  const { nome, precoMin, precoMax } = req.query;

  const min = Number(precoMin);
  const max = Number(precoMax);

  const produtos = await repo.listarProdutos(nome, min, max);
  resp.send({ produtos });
});

export default endpoints;