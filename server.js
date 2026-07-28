//importando o .env
import dotenv from 'dotenv'
dotenv.config()
//porta onde vai rodar a aplicação
const PORT = process.env.PORT || 3000;

import cookieParser from 'cookie-parser'

import checkUser from './app/middlewares/checkUser.js'
//importando framework que vai ser usado no projeto
import express from 'express'
//importando a template engine do projeto
import exphbs from 'express-handlebars'

import session from 'express-session'

//importando as flash message
import flash from 'express-flash'
//banco a conexão com o banco
import conn from './config/database.js'

//importando as rotas
import homeRoutes from './app/routes/homeRoutes.js'
import authRoutes from './app/routes/authRoutes.js'

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

app.use(cookieParser())

app.use(
    session({
        name: "session",
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,

        cookie: {
            httpOnly: true,
            maxAge: 3600000
        }
    })
)

//ativando as flash message
app.use(flash())

app.use(checkUser)

//pasta public
app.use(express.static('public'))

/* middleware para ROTAS
app.use('/', authRoutes)
app.use('/', homeRoutes)
*/
app.get('/teste', (req, res) => {
    res.send('Servidor funcionando');
});

console.log("ANTES DO START")

async function start(){

    console.log("ENTROU NO START")

    try{
        await conn.authenticate()

        console.log("BANCO OK")

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`SERVIDOR OK NA PORTA ${PORT}`)
        })

    } catch(err){
        console.log("ERRO:", err)
    }
}
start()