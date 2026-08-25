//script para sincronizar banco de dados ou subir alterações
//para rodar alguma sincronização ou alteração no banco de dados
//basta rodar node scripts/syncDatabase.js no terminal
import "../models/Agendamento.js"
import "../models/Barbeiro.js"
import "../models/Cliente.js"
import "../models/Servicos.js"
//importando a conexão com o banco
import conn from '../../config/database.js'

//sincronização do banco de dados
async function syncDatabase() {
    try {
        await conn.sync()
        console.log('banco sincronizado')
        process.exit(0)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}
syncDatabase()