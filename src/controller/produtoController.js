import multer from "multer";
import { Router } from "express";
import * as repo from "../repository/produtoRepository.js";
import { getAuthentication } from "../utils/jwt.js";

const upload = multer({ dest: "public/storage" });
const endpoints = Router();
const autenticar = getAuthentication();

endpoints.post(
  "/usuario/:id/produto",
  autenticar,
  upload.single("imagem"),
  async (req, resp) => {
    try {
      const idUsuario = req.params.id;
      const produto = req.body;
      const imagem = req.file.path;

      const novoId = await repo.cadastrarProd(idUsuario, produto, imagem);
      resp.send({ novoId });
    } catch (err) {
      console.error(err);
      resp.status(500).send({
        Erro: "Erro ao cadastrar o produto. Verifique o parâmetros.",
      });
    }
  }
);

endpoints.put(
  "/usuario/:id/produto/:idProduto",
  autenticar,
  upload.single("imagem"),
  async (req, resp) => {
    try {
      const idUsuario = req.params.id;
      const idProduto = req.params.idProduto;

      // Checagem de propriedade
      const produtoEncontrado = await repo.buscarProdId(idProduto);
      if (
        !produtoEncontrado[0] ||
        produtoEncontrado[0].id_usuario != idUsuario
      ) {
        return resp.status(403).send({
          Erro: "Você não pode alterar/excluir produto de outro usuário.",
        });
      }

      const produto = req.body;
      const imagem = req.file.path;

      const linhasAfetadas = await repo.alterarProd(idProduto, produto, imagem);
      if (linhasAfetadas === 0)
        return resp.status(400).send({ Erro: "Produto não encontrado" });

      resp.send({ linhasAfetadas });
    } catch (err) {
      console.error(err);
      resp.status(500).send({
        Erro: "Erro ao alterar o produto. Verifique o parâmetros.",
      });
    }
  }
);

endpoints.delete(
  "/usuario/:id/produto/:idProduto",
  autenticar,
  async (req, resp) => {
    try {
      const idProduto = req.params.idProduto;
      const idUsuario = req.params.id;

      // Checagem de propriedade
      const produtoEncontrado = await repo.buscarProdId(idProduto);
      if (
        !produtoEncontrado[0] ||
        produtoEncontrado[0].id_usuario != idUsuario
      ) {
        return resp.status(403).send({
          Erro: "Você não pode alterar/excluir produto de outro usuário.",
        });
      }

      const linhasAfetadas = await repo.deletarProd(idProduto);
      if (linhasAfetadas === 0)
        return resp.status(400).send({ Erro: "Produto não encontrado." });

      resp.send({ linhasAfetadas });
    } catch (err) {
      console.error(err);
      resp.status(500).send({
        Erro: "Erro ao Deletar o produto.",
      });
    }
  }
);

endpoints.get("/produto/listar", async (req, resp) => {
  try {
    const produtos = await repo.buscarProd();
    resp.send({ produtos });
  } catch (err) {
    console.error(err);
    resp.status(500).send({
      Erro: "Erro o listar os produtos.",
    });
  }
});

endpoints.get("/usuario/:id/produto", autenticar, async (req, resp) => {
  try {
    const idUsuario = req.params.id;

    const produtos = await repo.buscarProdId(idUsuario);

    if (produtos.length === 0)
      return resp.status(400).send({ Erro: "Nenhum produto encontrado." });

    resp.send({ produtos });
  } catch (err) {
    console.error(err);
    resp.status(500).send({
      Erro: "Erro ao buscar os produtos do usuário.",
    });
  }
});

export default endpoints;
