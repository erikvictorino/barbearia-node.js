import express from 'express'
const router = express.Router()
import Servicos from '../models/Servicos.js'

router.get('/', async (req, res) => {
    try {
        const servicos = await Servicos.findAll({raw: true})
        res.render('agendamento/servico', { servicos })
        console.log(servicos)
    } catch (error) {
        console.log(error)
        res.status(500).send('erro')
    }
})
export default router