import express from 'express'
const router = express.Router()
import Agendamento from '../controllers/agendamentoController.js'
import checkToken from '../middlewares/checkToken.js'
import authorizeRoles from '../middlewares/checkFuncao.js'

router.get('/', Agendamento.servicos)
/*rota para criar o agendamento no banco
router.post('/', checkToken, Agendamento.agendamentoPost)
*/
/*
rota para o adm ver todos os agendamentos
router.get('/agendamentosAll, checkToken, authorizeRoles("admin"), Agendamento.agendamentoAll)
*/
router.get('/agendamento', checkToken, Agendamento.dashboard)

export default router