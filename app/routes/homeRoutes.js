import express from 'express'
const router = express.Router()
import Servico from '../models/Servicos.js'

router.get('/', async (req, res) => {
    try {
        const servicos = await Servico.findAll()
        res.render('agendamento/servico', { servicos })
    } catch (error) {
        console.log(error)
        res.status(500).send('erro')
    }
})
export default router