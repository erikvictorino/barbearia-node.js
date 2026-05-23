//importando o framework
import express from 'express'
//modulo de rotas
const router = express.Router()
//
import authController from '../controllers/authController.js'

router.get('/login', authController.login)
router.post('/login', authController.loginPost)
router.get('/cadastro', authController.register)
router.post('/cadastro', authController.registerPost)
router.post('/logout', authController.logout)

//exportando as rotas
export default router