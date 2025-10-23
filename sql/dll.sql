CREATE DATABASE provapw;
USE provapw;

CREATE TABLE usuario(
id INT PRIMARY KEY AUTO_INCREMENT,
nome VARCHAR(200),
email VARCHAR(200),
senha VARCHAR(20)
);

CREATE TABLE produto(
id INT PRIMARY KEY AUTO_INCREMENT,
imagem VARCHAR(400),
preco DECIMAL(10,2),
descricao VARCHAR(150),
disponibilidade BOOLEAN,
criacao DATE,
id_dono INT,
FOREIGN KEY (id_dono) REFERENCES usuario(id)
);

CREATE TABLE proposta(
id INT PRIMARY KEY AUTO_INCREMENT,
produto_id INT,
usuario_id INT,
valor_proposta DECIMAL(10,2),
aprovacao VARCHAR(30),
criacao DATE,
FOREIGN KEY  (produto_id) REFERENCES produto(id),
FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);