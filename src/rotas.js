import produtoController from "./controller/produtoController.js";
import propostaController from "./controller/propostaController.js";
import usuarioController from "./controller/usuarioController.js";
import express from "express";

export function adicionarRotas(api) {
  api.use(usuarioController);
  api.use(propostaController);
  api.use(produtoController);
  api.use("/public/storage", express.static("public/storage"));
}
