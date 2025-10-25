import { connection } from "./connection.js";

export async function criarProposta(
  produtoId,
  usuarioId,
  valorProposta,
  aprovacao,
  criacao
) {
  const comando = `
  INSERT INTO proposta (produto_id, usuario_id, valor_proposta, aprovacao, criacao) 
                     VALUES (?, ?, ?, ?, ?);
  `;
  const [info] = await connection.query(comando, [
    produtoId,
    usuarioId,
    valorProposta,
    aprovacao,
    criacao,
  ]);
  return info.insertId;
}

export async function autorizarProposta(produtoId, usuarioId) {
  const comando = `
        UPDATE proposta
        SET aprovacao = TRUE
        WHERE produto_id = ? 
        AND usuario_id = ?;
    `;
  const [info] = await connection.query(comando, [produtoId, usuarioId]);
  return info.affectedRows;
}

export async function verificarProposta(produtoId, usuarioId) {
  const comando = `
        SELECT * FROM proposta
        WHERE produto_id = ? 
        AND usuario_id = ?
        AND aprovacao = TRUE;
    `;
  const [registros] = await connection.query(comando, [produtoId, usuarioId]);
  return registros[0];
}

export async function buscarPropostaPorId(id) {
  const comando = `
    SELECT *
      FROM proposta
     WHERE id = ?;
  `;
  const [linhas] = await connection.query(comando, [id]);
  return linhas[0];
}

export async function atualizarStatus(id, status) {
  const valor = (status.toLowerCase() === "aceitar") ? true : false;
  const comando = `
    UPDATE proposta
       SET aprovacao = ?
     WHERE id = ?;
  `;
  const [info] = await connection.query(comando, [valor, id]);
  return info.affectedRows;
}

export async function listarPropostasPorDono(usuarioId) {
  const comando = `
        SELECT proposta.id,
               proposta.valor_proposta,
               proposta.aprovacao,
               proposta.criacao,
               produto.id AS id_produto,
               produto.nome AS nome_produto,
               usuario.id AS id_usuario,
               usuario.nome AS nome_usuario
          FROM proposta
    INNER JOIN produto ON proposta.produto_id = produto.id
    INNER JOIN usuario ON proposta.usuario_id = usuario.id
         WHERE produto.id_dono = ?;
  `;
  const [linhas] = await connection.query(comando, [usuarioId]);
  return linhas;
}
