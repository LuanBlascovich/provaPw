import { connection } from "./conection.js";

export async function cadastrarProd(idUsuario, produto, imagem) {
    const comando = `
        insert into produto (id_usuario, nome, descricao, preco, imagem)
        values (?, ?, ?, ?, ?)
    `;
    const [info] = await connection.query(comando, [
        idUsuario,
        produto.nome,
        produto.descricao,
        produto.preco,
        imagem
    ]);
    return info.insertId;
}

export async function alterarProd(idProduto,produto, imagem){
    const comando = `
    update produto
    set nome = ?, descricao = ?, preco = ?, imagem = ?
    where id = ?
    `;
    const [info] = await connection.query(comando, [
        produto.nome,
        produto.descricao,
        produto.preco,
        imagem,
        idProduto
    ]);
    return info.affectedRows;
}

export async function deletarProd(idProduto){
    const comando = `
        delete from produto 
        where id = ?
    `;
    const [info] = await connection.query(comando,[idProduto]);
    return info.affectedRows
}

export async function buscarProd(){
    const comando = `
        SELECT p.id, p.nome, p.descricao, p.preco, p.imagem, u.nome AS usuario
        FROM produto p
        INNER JOIN usuario u ON u.id = p.id_usuario
    `;
    const [info] = await connection.query(comando);
    return info;
}

export async function buscarProdId(idUsuario){
    const comando = `
        select id, nome, descricao, preco, imagem
        from produto
        where id = ?
    `;
    const [info] = await connection.query(comando,[idUsuario]);
    return info;
}
