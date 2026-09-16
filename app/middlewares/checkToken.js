import jwt from 'jsonwebtoken'
import Cliente from '../models/Cliente.js'

async function checkToken(req, res, next){
    const token = req.cookies.token

    if(!token){
        req.flash('message', 'Você não tem permissões necessarias para acessar')
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
        req.flash('message', 'Usuario não encontrado')
        return res.redirect('/login')
    }
    req.user = user
    return next()
    } catch (err) {
        res.clearCookie('token')
        req.flash('message', 'Sessão expirada faça login novamente')
        return res.redirect('/login')
    }
}
export default checkToken