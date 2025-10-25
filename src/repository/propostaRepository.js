import { connection } from "./connection.js";

export async function criarProposta(idUsuarioLogado, produtoId, proposta) {
  const comando = `
    INSERT INTO proposta(produto_id, usuario_id, 
    valor_proposta, aprovacao, criacao)
    VALUES (?, ?, ?, "Aguardando resposta", NOW())`;
  const [info] = await connection.query(comando, [
    produtoId,
    idUsuarioLogado,
    proposta.valor,
  ]);
  return info.insertId;
}

export async function verificarProposta(produtoId) {
  const comando = `
    SELECT proposta.produto_id, proposta.id, usuario_id, usuario.nome, 
    valor_proposta, aprovacao, criacao 
    FROM proposta 
    INNER JOIN usuario ON proposta.usuario_id = usuario.id
    WHERE proposta.produto_id = ?`;
  const [info] = await connection.query(comando, [produtoId]);
  return info;
}

export async function aceitarProposta(idProposta) {
  const comando = `
    UPDATE proposta
    SET aprovacao = "Aprovada"
    WHERE id = ?`;
  const [info] = await connection.query(comando, [idProposta]);
  return info.affectedRows;
}

export async function rejeitarProposta(idProposta) {
  const comando = `
    UPDATE proposta
    SET aprovacao = "Rejeitada"
    WHERE id = ?`;
  const [info] = await connection.query(comando, [idProposta]);
  return info.affectedRows;
}

export async function marcarProdutoIndisponivel(idProposta) {
  const comando = `
    UPDATE produto
    SET disponibilidade = false
    WHERE id = (SELECT produto_id FROM proposta WHERE id = ?)`;
  const [info] = await connection.query(comando, [idProposta]);
  return info.affectedRows;
}

export async function listar() {
  const comando = `
    SELECT * FROM proposta`;
  const [info] = await connection.query(comando);
  return info;
}
