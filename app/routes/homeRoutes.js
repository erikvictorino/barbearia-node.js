import express from 'express'
const router = express.Router()
import Agendamento from '../controllers/agendamentoController.js'
import checkToken from '../middlewares/checkToken.js'

router.get('/', Agendamento.servicos)
/*rota para criar o agendamento no banco
router.post('/', Agendamento.agendamentoPost)
*/
router.get('/agendamento', checkToken, Agendamento.dashboard)

export default router