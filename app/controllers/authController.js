import Cliente from '../models/Cliente.js'
import bcrypt from 'bcryptjs'

export default class authController{
    static login(req, res){
        res.render('auth/login')
    }
    static async loginPost(req, res){
        const {telefone, senha} = req.body

        const user = await Cliente.findOne({where: {telefone}})

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
    static register(req, res){
        res.render('auth/register')
    }
    static async registerPost(req, res){
        const { nome, telefone, senha, confirma_senha} = req.body

        if(senha != confirma_senha){
            req.flash('message', 'As senhas não conferem, tente novamente')
            res.render('auth/register')
            return
        }

        const checkIfUserExists = await Cliente.findOne({where: {telefone}})

        if(checkIfUserExists){
            req.flash('message', 'O telefone já está em uso')
            res.render('auth/register')
            return
        }

        const salt = bcrypt.genSaltSync(10)
        const hashedSenha = bcrypt.hashSync(senha, salt)

        const cliente = {
            nome,
            telefone,
            senha: hashedSenha
        }

        try{
            const criarCliente = await Cliente.create(cliente)
            req.session.userId = criarCliente.id
            req.flash('message', 'Cadastro realizado com sucesso')
            req.session.save(() => {
                res.redirect('/')
            })
        } catch (err){
            console.log(err)
        }
    }
    static logout(req, res){
        req.session.destroy()
        res.redirect('/login')
    }
}