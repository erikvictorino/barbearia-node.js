//importando o framework
import express from 'express'
//modulo de rotas
const router = express.Router()
//controller de autenticação
import authController from '../controllers/authController.js'
//importando ratelimit
import rateLimit from '../middlewares/rateLimit.js'

router.get('/login', authController.login)
router.post('/login', rateLimit, authController.loginPost)
//rotas de redefinição de senha
router.get('/redefinir', authController.redefinirSenha)
router.post('/request-reset', authController.redefinirSenhaPost)
router.get('/reset-password/:token', authController.resetPassword)
router.post('/reset-password/:token', authController.resetPasswordPost)

router.get('/cadastro', authController.register)
router.post('/cadastro', authController.registerPost)
router.get('/logout', authController.logout)

//exportando as rotas
export default router