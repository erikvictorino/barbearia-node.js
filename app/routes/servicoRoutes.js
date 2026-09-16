import express from 'express'
const router = express.Router()
import Servico from '../controllers/servicoController.js'
import checkToken from '../middlewares/checkToken.js'
import authorizeRoles from '../middlewares/checkFuncao.js'
import upload from '../middlewares/upload.js'

router.get('/addServico', checkToken, authorizeRoles('admin'), Servico.addServico)
router.post('/addServico', checkToken, authorizeRoles('admin'), upload.single("image"), Servico.addServicoPost)

router.get('/editServico/:id', checkToken, authorizeRoles('admin'), Servico.editServico)
router.post('/editServico', checkToken, authorizeRoles('admin'), upload.single("image"), Servico.editServicoPost)
router.post('/editServico/delete', checkToken, authorizeRoles('admin'), Servico.deleteServico)

export default router