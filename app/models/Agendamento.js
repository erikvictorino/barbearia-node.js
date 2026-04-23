//importando os tipos de dados do sequelize
import {DataTypes} from 'sequelize'
//importando a conexão com o banco de dados
import db from '../../config/database.js'

//criando a tabela agendamento no banco
const Agendamento = db.define('agendamento', {
    //colunas da tabela
    cliente_id:{
        //tipo de dado armazenado na coluna
        type: DataTypes.INTEGER,
        allowNull: false //não pode estar vazio
    },
    barbeiro_id: {
        //tipo de dado armazenado na coluna
        type: DataTypes.INTEGER,
        allowNull: false //não pode estar vazio
    },
    servico_id: {
        //tipo de dado armazenado na coluna
        type: DataTypes.INTEGER,
        allowNull: false //não pode estar vazio
    },
    data: {
        //tipo de dado armazenado na coluna
        type: DataTypes.DATEONLY, //guarda somente a data
        allowNull: false //não pode estar vazio
    },
    hora: {
        //tipo de dado armazenado na coluna
        type: DataTypes.TIME, //guarda somente a hora
        allowNull: false //não pode estar vazio
    },
    status: {
        //tipo de dado armazenado na coluna
        type: DataTypes.STRING,
        allowNull: false //não pode estar vazio
    },
})
//exportando o model
export default Agendamento