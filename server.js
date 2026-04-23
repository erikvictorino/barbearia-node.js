//importando framework que vai ser usado no projeto
import express from 'express'
//importando a template engine do projeto
import exphbs from 'express-handlebars'

import session from 'express-session'
import FileStore from 'session-file-store'
const fileStore = FileStore(session)

//importando as flash message
import flash from 'express-flash'
//banco a conexão com o banco
import conn from './config/database.js'
//importando models
import User from './app/models/Cliente.js'
import Barbeiro from './app/models/Barbeiro.js'
import Service from './app/models/Servicos.js'
import Agendamento from './app/models/Agendamento.js'
//importando as rotas
import clienteRoutes from './app/routes/clienteRoutes.js'

//iniciando express na variavel app
const app = express()

//configuração da template engine
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

// configuração para receber dados do body das requisições (formulários)
app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.json)

/*

    AQUI VIRA UM MIDDLEWARE DE SESSÃO DO USUARIO

*/

//ativando as flash message
app.use(flash())
//pasta public
app.use(express.static('public'))


/*

 Middleware global que envia dados da sessão para as views

*/

// middleware para ROTAS
app.use('/', clienteRoutes)

//sincronizando os models com o banco de dados
conn
    //.sync({force: true})
    .sync()
    .then(() => {
        app.listen(3000)
    })
    .catch((err) => console.log(err))