import { Router } from "express";
import { getAuthentication } from "../utils/jwt.js";

const endpoints = Router();
const autenticar = getAuthentication();

import * as propostaRepo from "../repository/propostaRepository.js";
import { verificacaoDono } from "../repository/produtoRepository.js";

endpoints.post("/proposta/:produtoId", autenticar, async (req, resp) => {
  const produtoId = req.params.produtoId;
  const idUsuarioLogado = req.user.id;
  const proposta = req.body;
  const idProposta = await propostaRepo.criarProposta(idUsuarioLogado, produtoId, proposta);
  resp.send({ idProposta });
});

endpoints.put("/proposta/aprovar/:produtoId/:propostaId", autenticar, async (req, resp) => {
  const idUsuarioLogado = req.user.id;
  const produtoId = req.params.produtoId;
  const verificacao = await verificacaoDono(idUsuarioLogado, produtoId);
  if (verificacao == null) {
    return resp.status(401).send({ Erro: "Você não possui autorização para realizar essa ação" });
  }
  const propostaId = req.params.propostaId;
  const propostasAtualizadas = await propostaRepo.aceitarProposta(propostaId);
  await propostaRepo.marcarProdutoIndisponivel(propostaId);
  resp.send({ propostasAtualizadas });
});

endpoints.put("/proposta/negar/:produtoId/:propostaId", autenticar, async (req, resp) => {
  const idUsuarioLogado = req.user.id;
  const produtoId = req.params.produtoId;
  const verificacao = await verificacaoDono(idUsuarioLogado, produtoId);
  if (verificacao == null) {
    return resp.status(401).send({ Erro: "Você não possui autorização para realizar essa ação" });
  }
  const propostaId = req.params.propostaId;
  const propostasAtualizadas = await propostaRepo.rejeitarProposta(propostaId);
  resp.send({ propostasAtualizadas });
});

endpoints.get("/propostas/recebidas/:produtoId", autenticar, async (req, resp) => {
  const produtoId = req.params.produtoId;
  const propostas = await propostaRepo.verificarProposta(produtoId);
  resp.send({ propostas });
});

export default endpoints;
