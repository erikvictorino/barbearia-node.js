import express from 'express'
const router = express.Router()
import Cliente from '../controllers/clienteController.js'
import checkToken from '../middlewares/checkToken.js'
import authorizeRoles from '../middlewares/checkFuncao.js'

router.get('/clienteAll', checkToken, authorizeRoles('admin'), Cliente.clientesAll)

export default router