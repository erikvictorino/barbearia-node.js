import Agendamento from '../models/Agendamento.js'
import Cliente from '../models/Cliente.js'
import Servicos from '../models/Servicos.js'

export default class AgendamentoController{
    static async servicos(req, res){
        const servicos = await Servicos.findAll({raw: true})
        res.render('agendamento/servico', { servicos })
    }
    /*este metodo vai servir para criar os agendamentos no banco
    static async agendamentoPost(req, res){

    }*/
    static async dashboard(req, res){
        const userId = req.user.id
        if (!req.user.id) {
            return res.redirect('/login')
        }
        //buscando cliente no banco
        const cliente = await Cliente.findOne({
            where: {
                id: userId
            },
            //pega agendamentos relacionados ao ID
            include:[
                {
                    model: Agendamento,
                    include: [
                        {
                            model: Servicos,
                        }
                    ]
                }
            ]
        })

        console.log(JSON.stringify(cliente.toJSON(), null, 2))

        const agendamento = cliente.agendamentos.map((result) => result.get({plain: true}))
        console.log(agendamento)

        let emptyAgendamento = false
        if(agendamento.length === 0){
            emptyAgendamento = true
        }
        res.render('admin/agendamentos', {agendamento, emptyAgendamento})
    }
}