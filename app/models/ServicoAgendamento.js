//importando os tipos de dados do sequelize
import { DataTypes } from "sequelize";
//importando a conexão banco de dados 
import db from '../../config/database.js'

//criando a tabela ServicoAgendamento
const ServicoAgendamento = db.define('ServicoAgendamentos', {
    //colunas da tabela ServicoAgendamento
    agendamentoId: {
        //tipo de dado da coluna
        type: DataTypes.INTEGER,
        allowNull: false //não pode estar vazio
    },
    servicoId: {
        //tipo de dado da coluna
        type: DataTypes.INTEGER,
        allowNull: false //não pode estar vazio
    },
    preco: {
        //tipo de dado da coluna
        type: DataTypes.DECIMAL,
        allowNull:false //não pode estar vazio
    },
    duracao: {
        //tipo de dado da coluna
        type: DataTypes.INTEGER,
        allowNull: false //não pode estar vazio
    }
})

export default ServicoAgendamento