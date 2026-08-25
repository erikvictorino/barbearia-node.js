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
        //pegando os dados do agendamento do cliente
        const agendamento = {
            {data, hora} = req.body,
            userId = req.user.id
        }
        //pegando o id do serviço que o cliente escolheu
        conts servicoId = req.servico.id

        //criando agendamento no banco de dados
        const criaAgendamento = await Agendamento.Create(agendamento)

        //pegando o id do agendamento que acabou de ser criado
        const id_agendamento = criaAgendamento.data.id

        //criando o relacioanamento entre agendamento e serviços na tabela intermediaria
        const agendamentoServico = await ServicoAgendamento(id_agendamento, servicoId)

        res.redirect('admin/agendamentos')
    }
    */
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

        /*
        let emptyAgendamento = false
        if(agendamento.length === 0){
            emptyAgendamento = true
        }
        */
        res.render('admin/agendamentos', {agendamento})
    }

    /*
    este metodo vai servir para o barbeiro ver todos os agendamentos 
        static sync agendamentoAll(req, res){
            const userId = req.user.id
            if(!req.user.id){
                return res.redirect('/login')
            }
            
            const agendamentoAll = await Agendamento.findAll({
                include: [
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
            const agendamentoAll = cliente.agendamentos.map((resukt => result.get({plain: true})))
            res.render('admin/agendamentosAll', {agendamentoAll})
        }
    */
}