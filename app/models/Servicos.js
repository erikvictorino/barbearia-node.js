//importando os tipos de dados do sequelize
import { DataTypes } from "sequelize";
//importando a conexão banco de dados 
import db from '../../config/database.js'

//criando a tabela servico
const Servico = db.define('servico', {
    //colunas da tabela servico
    nome: {
        //tipo de dado da coluna
        type: DataTypes.STRING,
        allowNull: false //não pode estar vazio
    },
    preco: {
        //tipo de dado da coluna
        type: DataTypes.DECIMAL,
        allowNull: false //não pode estar vazio
    }
})
//exportando o model
export default Servico