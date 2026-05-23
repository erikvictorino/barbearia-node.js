import Agendamento from '../models/Agendamento.js'
import Cliente from '../models/Cliente.js'

export default class AgendamentoController{
    static async showAgendamentos(req, res){
        res.render('admin/agendamentos')
    }
    static async dashboard(req, res){
        const userId = req.session.userId
        const user = await Cliente.findOne({
            where: {
                id: userId
            },
            include: Agendamento,
            plain: true,
        })

        if(!user){
            return res.redirect('/login')
        }
        const agendamento = cliente.Agendamento.map((result) => result.dataValues)
        console.log(agendamento)

        let emptyAgendamento = false
        if(toughts.length === 0){
            emptyAgendamento = true
        }
        res.render('admin/agendamento', {agendamento, emptyAgendamento})
    }

    
}