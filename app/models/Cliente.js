//importando os tipos de dados do sequelize
import {DataTypes} from 'sequelize'
//importando a conexão com o banco dedados
import db from '../../config/database.js'
import resetPass from './resetPassToken.js'

//criando a tabela cliente no banco
const User = db.define('cliente', {
    //colunas da tabela
    nome: {
        //tipo de dado dessa coluna
        type: DataTypes.STRING,
        allowNull: false //não pode estar vazio
    },
    telefone: {
        //tipo de dado dessa coluna
        type: DataTypes.STRING,
        allowNull: false //não pode estar vazio
    },
    email: {
        //tipo de dado dessa coluna
        type: DataTypes.STRING,
        allowNull: false //não pode estar vazio
    },
    senha: {
        //tipo de dado dessa coluna
        type: DataTypes.STRING,
        allowNull: false //não pode estar vazio
    },
    tipo_usuario: {
        //tipo de dado dessa coluna
        type: DataTypes.STRING,
        allowNull: false, //não pode estar vazio
    }
})
//um cliente possui um token
User.hasOne(resetPass, {
    foreignKey: 'clienteId'
})
//um token pertence a um cliente
resetPass.belongsTo(User,{
    foreignKey: 'clienteId'
})

//exportando o model
export default User