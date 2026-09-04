import express from 'express'
const router = express.Router()
import Servico from '../controllers/servicoController.js'
import checkToken from '../middlewares/checkToken.js'
import authorizeRoles from '../middlewares/checkFuncao.js'

router.get('/addServico', checkToken, authorizeRoles('admin'), Servico.addServico)

router.get('/editServico', checkToken, authorizeRoles('admin'), Servico.editServico)

export default router