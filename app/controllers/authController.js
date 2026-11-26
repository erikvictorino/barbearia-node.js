import { sendMail } from '../../config/mailer.js'
import Cliente from '../models/Cliente.js'
import resetPass from '../models/resetPassToken.js'
import crypto from 'node:crypto'
import dotenv from 'dotenv'
//importando a biblioteca de criptografia
import bcrypt from 'bcryptjs'
//importando o jwt
import jwt from 'jsonwebtoken'

export default class authController {
    static login(req, res) {
        res.render('auth/login')
    }
    static async loginPost(req, res) {
        const { telefone, senha } = req.body

        //se não vier telefone ou telefone for igual a string vazia cai no if
        //mesma condição para senha
        if (!telefone || telefone.trim() === "" || !senha) {
            req.flash( 'message', 'Telefone e senha são obrigatorios' )
            return res.redirect('/login')
        }

        //resgatando cliente
        const user = await Cliente.findOne({ where: { telefone } })

        if (!user) {
            req.flash('message', 'Telefone ou senha incorretos')
            return res.redirect('/login')
        }
        //comparando senhas
        const senhaCerta = bcrypt.compareSync(senha, user.senha)

        if (!senhaCerta) {
            req.flash('message', 'Usuario ou senha incorretos tente novamente')
            return res.redirect('/login')
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' })
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

    static redefinirSenha(req, res) {
        res.render('auth/emailParaRedefinirSenha')
    }

    static async redefinirSenhaPost(req, res) {
        //pegando o email digitado pelo usuario
        const { email } = req.body

        try {
            //verificando se o usuario existe no banco de dados
            const user = await Cliente.findOne({ where: { email } })
            if (!user) {
                req.flash('message', 'Se o e-mail estiver cadastrado, você receberá um link')
                return res.redirect('/redefinir')
            }
            //gerando o token de reset
            const resetToken = crypto.randomBytes(32).toString("hex")
            //definindo tempo de expiração do token
            const expiresAt = new Date(Date.now() + 1000 * 60 * 15)

            //deletando o token antigo do usuario caso tenha
            await resetPass.destroy({
                where: { clienteId: user.id }
            })

            //salvando token no banco de dados
            await resetPass.create({
                //token criado
                token: resetToken,
                //id do cliente
                clienteId: user.id,
                //tempo de expiração do token
                expiresAt
            })

            //try catch para tratamento de erros relacionado ao envio do email
            try {
                //chamando função de enviar email
                await sendMail(
                    //destinatario
                    user.email,
                    //assunto do email
                    "Redefinição de senha",
                    //html para redefinição de senha
                    `
                <h2> Olá, ${user.nome}</h2>
                <p>Você solicitou redefinição de senha. Clique no link abaixo para redefinir: </p>
                <a href="${process.env.API_URL}/reset-password/${resetToken}">
                    Redefinir minha senha
                </a>
                <p>Esse link expira em 15 minutos.</p>
                `,
                )
                req.flash('message', 'Email enviado com sucesso')
                return res.redirect('/redefinir')
            } catch (error) {
                //se o envio do email falhar o token recen criado é destroido
                await resetPass.destroy({
                    where: { token: resetToken }
                })
                req.flash('message', 'Não foi possível enviar o e-mail de redefinição de senha. Tente novamente.')
                return res.redirect('/redefinir')
            }
        } catch (error) {
            console.error("Erro em requestPasswordReset:", error)
            req.flash('message', 'Erro interno')
            return res.redirect('/redefinir')
        }
    }

    static resetPassword(req, res) {
        const token = req.params.token
        res.render('auth/redefinir', { token })
    }

    //criando a função para salvar a nova senha 
    static async resetPasswordPost(req, res) {
        //pegando o token pela URL
        const token = req.params.token
        //pegando a nova senha do usuario
        const { novaSenha, confirmarNovaSenha } = req.body

        if (novaSenha !== confirmarNovaSenha) {
            req.flash('message', 'As senhas não conferem, tente novamente')
            return res.redirect(`/reset-password/${token}`)
        }

        try {
            //resgatando o token do banco de dados 
            const resetToken = await resetPass.findOne({ where: { token } })
            //verificando se o token existe ou se ainda esta valido
            if (!resetToken || resetToken.expiresAt < new Date()) {
                req.flash('message', 'Token invalido ou expirado, tente novamente')
                return res.redirect(`/reset-password/${token}`)
            }
            //encriptando a nova senha do usuario
            const salt = bcrypt.genSaltSync(10)
            const hashedSenha = bcrypt.hashSync(novaSenha, salt)
            //atualizando a senha do usuario
            await Cliente.update(
                {
                    senha: hashedSenha,
                },
                {
                    where: { id: resetToken.clienteId, }
                })
            //deletando o token depois de usado
            await resetPass.destroy({
                where: { id: resetToken.id }
            })
            req.flash('message', 'Senha atualizada com sucesso')
            return res.redirect('/')
        } catch (error) {
            console.log(error)
            req.flash('message', 'Erro interno')
            return res.redirect('/login')
        }
    }

    static register(req, res) {
        res.render('auth/register')
    }

    static async registerPost(req, res) {
        const { nome, telefone, email, senha, confirma_senha } = req.body

        //validando se veio todos os dados
        //se não vier nome ou nome for igual a string vazia mostra erro
        if (!nome || nome.trim() === "") {
            req.flash( 'message', 'Nome é obrigatorio' )
            return res.redirect('/register')
        }
        //se não vier telefone ou telefone for igual a string vazia mostra erro
        else if (!telefone || telefone.trim() === "") {
            req.flash( 'message', 'Telefone é obrigatorio' )
            return res.redirect('/register')
        }
        //se não vier email ou email for igual a string vazia mostra erro
        else if (!email || email.trim() === "") {
            req.flash( 'message', 'E-mail é obrigatorio' )
            return res.redirect('/register')
        }
        else if (!senha) {
            req.flash( 'message', 'senha é obrigatoria' )
            return res.redirect('/register')
        }
        else if (!confirma_senha) {
            req.flash( 'message', 'Contra senha é obrigatorio' )
            return res.redirect('/register')
        }

        if (senha !== confirma_senha) {
            req.flash('message', 'As senhas não conferem, tente novamente')
            return res.redirect('/register')
        }

        const checkIfUserExists = await Cliente.findOne({ where: { telefone } })

        if (checkIfUserExists) {
            req.flash('message', 'Este telefone já possui uma conta. Faça login ou redefina sua senha caso não se lembre dela.')
            return res.redirect('/login')
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

        try {
            const novoCliente = await Cliente.create(cliente)
            req.flash('message', 'Cadastro realizado com sucesso')
            const token = jwt.sign({ id: novoCliente.id }, process.env.JWT_SECRET, { expiresIn: '1h' })
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
        } catch (err) {
            console.log(err)
            req.flash('message', 'Erro ao realizar cadastro')
            return res.redirect('/register')
        }
    }
    static logout(req, res) {
        res.clearCookie('token')
        return res.redirect('/login')
    }
}