import { connection } from "./conection.js";

export async function cadastro(usuario) {
  const comando = `INSERT INTO usuario(nome, email, senha)
    VALUES(?, ?, MD5(?)`;
  const [info] = await connection.query(comando, [
    usuario.nome,
    usuario.email,
    usuario.senha,
  ]);
  return info.insertId;
}

export async function login(email, senha) {
  const comando = `SELECT id, nome, email FROM usuario
    WHERE email = ? and senha = MD5(?)`;
  const [info] = await connection(comando, [email, senha]);
  return info[0];
}

export async function alterar(id, usuario) {
  const comando = `UPDATE usuario SET nome = ?, email = ? WHERE id = ?`;
  const [info] = await connection.query(comando, [
    usuario.nome,
    usuario.email,
    id,
  ]);
  return info.affectedRows;
}

export async function excluir(id) {
  const comando = `DELETE FROM usuario WHERE id = ?`;
  const [info] = await connection.query(comando, [id]);
  return info.affectedRows;
}

export async function listar() {
  const comando = `SELECT id, nome, email FROM usuario`;
  const [info] = await connection.query(comando);
  return info;
}

export async function buscar(id) {
  const comando = `SELECT id, nome, email FROM usuario WHERE id = ?`;
  const [info] = await connection.query(comando, [id]);
  return info;
}
