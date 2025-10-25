import { connection } from "./connection.js";

export async function postarProd(idUsuarioLogado, produto, caminhoImagem) {
    const comando = `
        INSERT INTO produto(nome, imagem, preco, descricao, 
        disponibilidade, criacao, id_dono)
        VALUES (?, ?, ?, ?, TRUE, NOW(), ?)`;
    const [info] = await connection.query(comando, [
        produto.nome,
        caminhoImagem,
        produto.preco,
        produto.descricao,
        idUsuarioLogado
    ]);
    return info.insertId;
}

export async function verificacaoDono(idUsuarioLogado, idProduto) {
    const comando = `
    SELECT id FROM produto WHERE id_dono = ? AND id = ?`;
    const [info] = await connection.query(comando, [idUsuarioLogado, idProduto]);
    return info[0];
}

export async function alterarProd(idProduto, produto, caminhoImagem) {
    const comando = `
    UPDATE produto SET nome = ?, imagem = ?, preco = ?, 
    descricao = ?, disponibilidade = ?
    WHERE id = ?`;
    const [info] = await connection.query(comando, [
        produto.nome,
        caminhoImagem,
        produto.preco,
        produto.descricao,
        produto.disponibilidade,
        idProduto
    ]);
    return info.affectedRows;
}

export async function deletarProd(idProduto) {
    const comando = `DELETE FROM produto WHERE id = ?`;
    const [info] = await connection.query(comando, [idProduto]);
    return info.affectedRows
}

export async function listarProdutos(nomeProduto, precoMin, precoMax) {
    if (nomeProduto && precoMin != null && precoMax != null) {
        return listarProdutosCompleto(nomeProduto, precoMin, precoMax);
    } else if (!nomeProduto && precoMin != null && precoMax != null) {
        return listarProdutosPreco(precoMin, precoMax);
    } else if (nomeProduto) {
        return listarProdutosNome(nomeProduto);
    } else {
        return listarProdutosNome("");
    }
}

async function listarProdutosCompleto(nomeProduto, precoMin, precoMax) {
    const comando = `
        SELECT usuario.id, usuario.nome, produto.id, produto.nome, imagem, preco, descricao, disponibilidade, 
        criacao FROM produto INNER JOIN usuario ON produto.id_dono = usuario.id 
        WHERE disponibilidade = true AND produto.nome LIKE ? AND preco BETWEEN ? AND ?`;
    const [info] = await connection.query(comando, ["%" + nomeProduto + "%", precoMin, precoMax]);
    return info;
}

async function listarProdutosNome(nomeProduto) {
    const comando = `
        SELECT usuario.id, usuario.nome, produto.id, produto.nome, imagem, preco, descricao, disponibilidade, 
        criacao FROM produto INNER JOIN usuario ON produto.id_dono = usuario.id 
        WHERE disponibilidade = true AND produto.nome LIKE ?`;
    const [info] = await connection.query(comando, ["%" + nomeProduto + "%"]);
    return info;
}

async function listarProdutosPreco(precoMin, precoMax) {
    const comando = `
        SELECT usuario.id, usuario.nome, produto.id, produto.nome, imagem, preco, descricao, disponibilidade, 
        criacao FROM produto INNER JOIN usuario ON produto.id_dono = usuario.id 
        WHERE disponibilidade = true AND preco BETWEEN ? AND ?`;
    const [info] = await connection.query(comando, [precoMin, precoMax]);
    return info;
}

export async function listarProdutosUsuario(idUsuario) {
    const comando = `
        SELECT usuario.id, usuario.nome, produto.id, produto.nome, imagem, preco, descricao, disponibilidade, 
        criacao FROM produto INNER JOIN usuario ON produto.id_dono = usuario.id WHERE disponibilidade = true AND id_dono = ?`;
    const [info] = await connection.query(comando, [idUsuario]);
    return info;
}