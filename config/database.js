//importando ORM do projeto
import {Sequelize} from 'sequelize'

//criando a conexão com banco de dados
//com parametros, nome do banco, usuario, senha.
const sequelize = new Sequelize('barbearia', 'root', 'root123', {
    //local onde esta o banco
    host: 'localhost',
    //tipo de banco que esta sendo usado
    dialect: 'mysql'
});

try {
    //testando a conexão
     await sequelize.authenticate()
    //mensagem de sucesso
    console.log('banco conectado com sucesso')
} catch (err) {
    //mostrando erro de conexão
    console.log(`não foi possivel conectar: ${err}`)
}
//exportando a conexão com o banco de dados
export default sequelize