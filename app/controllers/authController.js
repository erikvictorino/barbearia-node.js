import Cliente from '../models/Cliente.js'
//importando a biblioteca de criptografia
import bcrypt from 'bcryptjs'
//importando o jwt
import jwt from 'jsonwebtoken'



export default class authController{
    static login(req, res){
        res.render('auth/login')
    }
    static async loginPost(req, res){
        const {telefone, senha} = req.body

        //resgatando cliente
        const user = await Cliente.findOne({where: {telefone}})

        if(!user){
            req.flash('message', 'Usuario ou senha incorretos tente novamente')
            return res.redirect('/login')
        }
        //comparando senhas
        const senhaCerta = bcrypt.compareSync(senha, user.senha)

        if(!senhaCerta){
            req.flash('message', 'Usuario ou senha incorretos tente novamente')
            return res.redirect('/login')
        }
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '1h'})
        res.cookie(
            'token',
            token,
            {
                httpOnly: true,
                secure: false,
                maxAge: 3600000,
            }
        )
        req.flash('message', 'Logado com sucesso')
        return res.redirect('/')
    }

    static register(req, res){
        res.render('auth/register')
    }
    
    static async registerPost(req, res){
        const { nome, telefone, senha, confirma_senha} = req.body

        if(senha !== confirma_senha){
            req.flash('message', 'As senhas não conferem, tente novamente')
            return res.render('auth/register')
        }

        const checkIfUserExists = await Cliente.findOne({where: {telefone}})

        if(checkIfUserExists){
            req.flash('message', 'O telefone já está em uso')
            return res.render('auth/register')
        }

        const salt = bcrypt.genSaltSync(10)
        const hashedSenha = bcrypt.hashSync(senha, salt)

        const cliente = {
            nome,
            telefone,
            senha: hashedSenha
        }

        try{
        const novoCliente = await Cliente.create(cliente)
        req.flash('message', 'Cadastro realizado com sucesso')
        const token = jwt.sign({id: novoCliente.id}, process.env.JWT_SECRET, {expiresIn: '1h'})
        res.cookie(
            'token',
            token,
            {
                httpOnly: true,
                secure: false,
                maxAge: 3600000,
            }
        )
        return res.redirect('/')
        } catch (err){
            console.log(err)
            req.flash('message', 'Erro ao realizar cadastro')
            return res.redirect('/register')
        }
    }
    static logout(req, res){
        res.clearCookie('token')
        return res.redirect('/login')
    }
}