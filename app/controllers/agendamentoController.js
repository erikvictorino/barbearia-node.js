import Agendamento from '../models/Agendamento.js'
import Cliente from '../models/Cliente.js'

export default class AgendamentoController{
    static async showAgendamentos(req, res){
        res.render('admin/agendamentos')
    }
    static async dashboard(req, res){
        const userId = req.session.userId
        //buscando cliente no banco
        const cliente = await Cliente.findOne({
            where: {
                id: userId
            },
            //pega agendamentos relacionados ao ID
            include: Agendamento,
            plain: true,
        })

        if(!cliente){
            return res.redirect('/login')
        }

        const agendamento = cliente.Agendamento.map((result) => result.dataValues)
        console.log(agendamento)

        let emptyAgendamento = false
        if(agendamento.length === 0){
            emptyAgendamento = true
        }
        res.render('admin/agendamento', {agendamento, emptyAgendamento})
    }
}