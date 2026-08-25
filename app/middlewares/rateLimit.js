//importando rateLimit
import rateLimit from "express-rate-limit"

//criando o rateLimit
const ratelimit = rateLimit({
    //tempo em que as requisições vão ser contadas
    windowMs: 1*60*1000,
    //quantidade maxima de requisições que vão ser contadas dentro do tempo estabelecido
    max: 3,
    //tratamento para quando u usuario ultrapassar o limite de requisição
    handler: (req, res) => {
        //mensagem para usuario
        req.flash('message', 'Muitas tentativas tente novamente mais tarde'),
        //redirecionamento
        res.redirect('/')
    },
    //metodo para utilizar headers http
    standardHeaders: true,
    //metodo para não usar headers antigos do rateLimit
    legacyHeaders: false,
})

export default ratelimit