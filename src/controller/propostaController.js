import { Router } from "express";
import { getAuthentication } from "../utils/jwt.js";

const endpoints = Router();
const autenticar = getAuthentication();

import * as propostaRepo from "../repository/propostaRepository.js";
import * as produtoRepo from "../repository/produtoRepository.js";

endpoints.post("/proposta/:produtoId", autenticar, async (req, resp) => {
  try {
    const produtoId = req.params.produtoId;
    const usuarioId = req.user.id;
    const valorProposta = req.body.valorProposta;

    if (!valorProposta)
      return resp.status(400).send({ erro: "O valor da proposta é obrigatório." });

    const produto = await produtoRepo.buscarProdutoPorId(produtoId);
    if (!produto)
      return resp.status(404).send({ erro: "Produto não encontrado." });

    if (produto.id_dono === usuarioId)
      return resp.status(403).send({ erro: "Você não pode fazer proposta no seu próprio produto." });

    
    const propostaId = await propostaRepo.criarProposta(
      produtoId,
      usuarioId,
      valorProposta,
      false,
      new Date()
    );

    resp.status(201).send({
      mensagem: "Proposta enviada com sucesso!",
      id_proposta: propostaId,
      produto_id: produtoId,
      usuario_id: usuarioId,
      valorProposta,
      aprovacao: "pendente",
    });
  } catch (error) {
    console.error(error);
    resp.status(500).send({ erro: "Erro ao fazer proposta." });
  }
});

endpoints.put("/proposta/:id/aprovacao", autenticar, async (req, resp) => {
  try {
    const propostaId = req.params.id;
    const usuarioLogadoId = req.user.id;
    const aprovacao = req.body.aprovacao;

    if (!aprovacao || !["aceitar", "rejeitar"].includes(aprovacao.toLowerCase()))
      return resp.status(400).send({ erro: "Ação inválida. Use 'aceitar' ou 'rejeitar'." });

    const proposta = await propostaRepo.buscarPropostaPorId(propostaId);
    if (!proposta)
      return resp.status(404).send({ erro: "Proposta não encontrada." });

    const produto = await produtoRepo.buscarProdutoPorId(proposta.produto_id);
    if (!produto || produto.id_dono !== usuarioLogadoId)
      return resp.status(403).send({ erro: "Apenas o dono do produto pode responder propostas." });

    if (aprovacao.toLowerCase() === "aceitar") {
      await propostaRepo.atualizarStatus(propostaId, "aceita");
      await produtoRepo.atualizarDisponibilidade(produto.id, false);
      resp.status(200).send({ mensagem: "Proposta aceita e produto marcado como indisponível." });
    } else {
      await propostaRepo.atualizarStatus(propostaId, "rejeitada");
      resp.status(200).send({ mensagem: "Proposta rejeitada com sucesso." });
    }
  } catch (error) {
    console.error(error);
    resp.status(500).send({ erro: "Erro ao responder proposta." });
  }
});

endpoints.get("/propostas/recebidas", autenticar, async (req, resp) => {
  try {
    const usuarioId = req.user.id;
    const propostas = await propostaRepo.listarPropostasPorDono(usuarioId);
    resp.status(200).send(propostas);
  } catch (error) {
    console.error(error);
    resp.status(500).send({ erro: "Erro ao listar propostas." });
  }
});

export default endpoints;
