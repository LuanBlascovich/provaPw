import mysql2 from 'mysql2/promise';

const connection = await mysql2.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PWD,
    database: process.env.MYSQL_DB
});

const laranja = "\x1b[38;5;208m";
const resetCor = "\x1b[0m";

console.log(
  `${laranja}...: Conexão com Banco de Dados estabelecida :...${resetCor}`
);


export {connection};