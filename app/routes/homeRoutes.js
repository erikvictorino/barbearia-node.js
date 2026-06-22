import express from 'express'
const router = express.Router()
import Agendamento from '../controllers/agendamentoController.js'

router.get('/', Agendamento.servicos)
/*rota para criar o agendamento no banco
router.post('/', Agendamento.agendamentoPost)
*/
router.get('/agendamento', Agendamento.dashboard)


export default router