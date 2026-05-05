//importando o framework
import express from 'express'
//modulo de rotas
const router = express.Router()
//
import authController from '../controllers/authController.js'

router.get('/login', authController.login)
router.post('/login', authController.loginPost)

//exportando as rotas
export default router