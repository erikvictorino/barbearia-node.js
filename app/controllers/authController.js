import Cliente from '../models/Cliente.js'
import bcrypt from 'bcryptjs'

export default class authController{
    static login(req, res){
        res.render('auth/login')
    }
    static async loginPost(req, res){
        const {numero, senha} = req.body

        const user = await Cliente.findOne({where: {numero}})

        if(!user){
            req.flash('message', 'Usuario não encontrado!')
            res.redirect('/login')
            return
        }

        const senhaCerta = bcrypt.compareSync(senha, user.senha)

        if(!senhaCerta){
            req.flash('message', 'Senha incorreta! tente novamente')
            res.redirect('/login')
            return
        }
        req.session.userId = user.id
        req.flash('message', 'Logado com sucesso')
        req.session.save(() => {
            res.redirect('/')
        })
    }
}