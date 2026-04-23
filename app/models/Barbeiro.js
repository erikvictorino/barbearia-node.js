//importando os tipos de dados do sequelize
import { DataTypes } from "sequelize";
//importando a conexão com o banco de dados
import db from '../../config/database.js'

//criando a tabela barbeiro no banco 
const Barbeiro = db.define('barbeiro', {
    //coluna da tabela
    nome: {
        //tipo de dado dessa coluna
        type: DataTypes.STRING,
        allowNull: false //não pode estar vazio
    }
})
//exportando o model
export default Barbeiro