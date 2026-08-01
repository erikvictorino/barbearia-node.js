//importando o .env
import dotenv from 'dotenv'
dotenv.config()

import mysql2 from "mysql2"

//importando ORM do projeto
import {Sequelize} from 'sequelize'

const dbConfig = {
    //local onde esta o banco
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    //tipo de banco que esta sendo usado
    dialect: 'mysql',
}

//criptografia da conexão com o banco de dados
const useSSL = process.env.DB_SSL === 'true'

if(useSSL){
    dbConfig.dialectOptions = {
    ssl: {
        require: true,
        rejectUnauthorized: false
    }
}
}


//criando a conexão com banco de dados
//com parametros, nome do banco, usuario, senha.
const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER,
    process.env.DB_PASS, 
    dbConfig
);

//exportando a conexão com o banco de dados
export default sequelize