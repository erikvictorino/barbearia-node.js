//importando os tipos de dados do sequelize
import {DataTypes} from 'sequelize'
//importando a conexão com o banco de dados
import db from '../../config/database.js'
//models cliente
import Cliente from './Cliente.js'
//models serviços
import Servicos from './Servicos.js'

//criando a tabela agendamento no banco
const Agendamento = db.define('agendamento', {
    //colunas da tabela
    barbeiro_id: {
        //tipo de dado armazenado na coluna
        type: DataTypes.INTEGER,
        //allowNull: false //não pode estar vazio
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

//um cliente pode ter varios agendamentos
Cliente.hasMany(Agendamento)
//cada agendamento pertence a um cliente
Agendamento.belongsTo(Cliente)

//um serviço pode ter varios agendamentos
Servicos.belongsToMany(Agendamento, {
    //criando tabela intermediaria que vai guardar os IDs do servico e agendamento
    through: 'ServicoAgendamento'
})

//um agendamento pode ter varios serviços
Agendamento.belongsToMany(Servicos, {
    //criando tabela intermediaria
    through: 'ServicoAgendamento'
})

//exportando o model
export default Agendamento