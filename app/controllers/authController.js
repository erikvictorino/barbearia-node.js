import { sendMail } from '../../config/mailer.js'
import Cliente from '../models/Cliente.js'
import resetPass from '../models/resetPassToken.js'
import crypto from 'node:crypto'
import dotenv from 'dotenv'
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
            req.flash('message', 'Usuario não encontrado')
            return res.redirect('/cadastro')
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

    static redefinirSenha(req, res){
        res.render('auth/emailParaRedefinirSenha')
    }
    
    static async redefinirSenhaPost(req, res){
        //pegando o email digitado pelo usuario
        const {email} = req.body

        try {
            //verificando se o usuario existe no banco de dados
            const user = await Cliente.findOne({where: {email}})
            if(!user){
                return res.status(404).json({error: 'Usuario não encontrado faça um registro no site'})
            }
            //gerando o token de reset
            const resetToken = crypto.randomBytes(32).toString("hex")
            //definindo tempo de expiração do token
            const expiresAt = new Date(Date.now() + 1000 * 60 * 15)

            //salvando token no banco de dados
            await resetPass.create({
                //token criado
                token: resetToken,
                //id do cliente
                clienteId: user.id,
                //tempo de expiração do token
                expiresAt
            })
            //chamando função de enviar email
            await sendMail(
                //destinatario
                user.email,
                //assunto do email
                "Redefinição de senha",
                //html para redefinição de senha
                `
                <h2> Olá, ${user.name}</h2>
                <p>Você solicitou redefinição de senha. Clique no link abaixo para redefinir: </p>
                <a href="http://localhost:${process.env.PORT}/reset-password/${resetToken}">
                    Redefinir minha senha
                </a>
                <p>Esse link expira em 15 minutos.</p>
                `,
                console.log('RESET TOKEN:', resetToken),
                console.log('LINK:', `http://localhost:${process.env.PORT}/reset-password/${resetToken}`)
            )
            req.flash('message', 'Email enviado com sucesso')
            return res.redirect('/redefinir')
        } catch (error) {
            console.error("Erro em requestPasswordReset:", error)
            req.flash('message', 'Erro interno')
            return res.redirect('/redefinir')
        }
    }

    static resetPassword(req, res){
        const token = req.params.token
        res.render('auth/redefinir', {token})
    }

    //criando a função para salvar a nova senha 
    static async resetPasswordPost(req, res){
        //pegando o token pela URL
        const token = req.params.token
        console.log('TOKEN:', token)
        //pegando a nova senha do usuario
        const {novaSenha, confirmarNovaSenha} = req.body

        try {
            //resgatando o token do banco de dados 
            const resetToken = await resetPass.findOne({where: {token}})
            //verificando se o token existe ou se ainda esta valido
            if(!resetToken || resetToken.expiresAt < new Date()){
                return req.flash('message', 'Token invalido ou expirado')
            }
            //encriptando a nova senha do usuario
            const hashedSenha = bcrypt.hashSync(novaSenha, 10)
            //atualizando a senha do usuario
            await Cliente.update(
            {
                senha: hashedSenha,
            },
            {
                where: {id: resetToken.clienteId,}
            })
            //deletando o token depois de usado
            await resetPass.destroy({
                where: {id: resetToken.id}
            })
            return req.flash('message', 'Senha atualizada com sucesso')
        } catch (error) {
            console.log(error)
            return req.flash('message', 'Erro interno')
        }
    }

    static register(req, res){
        res.render('auth/register')
    }
    
    static async registerPost(req, res){
        const { nome, telefone, email, senha, confirma_senha} = req.body

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
            email,
            senha: hashedSenha,
            tipo_usuario: "user",
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