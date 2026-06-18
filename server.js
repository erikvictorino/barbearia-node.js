//importando o .env
import dotenv from 'dotenv'
dotenv.config()

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
import homeRoutes from './app/routes/homeRoutes.js'
import authRoutes from './app/routes/authRoutes.js'

import { join } from 'path'
import { tmpdir } from 'os'

//iniciando express na variavel app
const app = express()

//configuração da template engine
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')
app.set('views', 'app/views')

// configuração para receber dados do body das requisições (formulários)
app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.json())

app.use(
    session({
        name: "session",
        secret: "nosso_secret",
        resave: false,
        saveUninitialized: false,

        store: new fileStore({
            logFn: function () { },
            path: join(tmpdir(), 'sessions'),
        }),

        cookie: {
            secure: false,
            maxAge: 360000,
            expires: new Date(Date.now() + 360000),
            httpOnly: true,
        }
    })
)

//ativando as flash message
app.use(flash())
//pasta public
app.use(express.static('public'))

//mandando sessões do usuario para as views
app.use((req, res, next) => {
    if (req.session.userId) {
        res.locals.session = req.session
    }
    next()
})

// middleware para ROTAS
app.use('/', authRoutes)
app.use('/', homeRoutes)

//sincronizando os models com o banco de dados
conn
    //.sync({force: true})
    .sync()
    .then(() => {
        app.listen(process.env.PORT)
    })
    .catch((err) => console.log(err))