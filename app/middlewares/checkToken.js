import jwt from 'jsonwebtoken'
import Cliente from '../models/Cliente.js'

async function checkToken(req, res, next){
    const token = req.cookies.token

    //sem token o usuário é obrigado a passar pelo login/cadastro
    if(!token){
        req.flash('message', 'Faça login ou cadastre-se para continuar')
        return res.redirect('/login')
    }

    try {
        const secret = process.env.JWT_SECRET
        const decoded = jwt.verify(token, secret)

        const user = await Cliente.findOne({
            where: {
                id: decoded.id,
            }
        })

        if(!user){
            res.clearCookie('token')
            req.flash('message', 'Usuario não encontrado, faça seu cadastro')
            return res.redirect('/cadastro')
        }

        req.user = user
        //deixa o usuário disponível também para as views
        res.locals.user = user
        res.locals.isAdmin = user.tipo_usuario === 'admin'
        return next()
    } catch (err) {
        res.clearCookie('token')
        req.flash('message', 'Sessão expirada faça login novamente')
        return res.redirect('/login')
    }
}

export default checkToken