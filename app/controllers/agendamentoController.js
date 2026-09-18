import { where } from 'sequelize'
import Agendamento from '../models/Agendamento.js'
import Cliente from '../models/Cliente.js'
import Servicos from '../models/Servicos.js'
import ServicoAgendamento from '../models/ServicoAgendamento.js'

export default class AgendamentoController{
    static async servicos(req, res){
        try {
            const servicos = await Servicos.findAll({raw: true})
            return res.render('agendamento/servico', { servicos })
        } catch (error) {
            console.log(error)
        }
    }
    //este metodo vai servir para criar os agendamentos no banco
    static async agendamentoPost(req, res){
        if(!req.user.id){
            return res.redirect('/')
        }

        try {
            //pegando os dados do agendamento do cliente
            const agendamento = {
                data: req.body.data,
                hora: req.body.hora,
                clienteId: req.user.id,
                status: 'pendente',
                barbeiro_id: 1
            }
            //criando agendamento no banco de dados
            const criaAgendamento = await Agendamento.create(agendamento)
            //pegando id do serviço que foi escolhido
            const servicoId = req.body.id
            //pegando os dados do serviço escolhido
            const servico = await Servicos.findByPk(servicoId)

            //criando objeto com os dados do serviço escolhido
            const servico_Agendamento = {
                //pegando o id do agendamento que acabou de ser criado
                agendamentoId: criaAgendamento.id,
                servicoId,
                preco: servico.preco,
                duracao: servico.duracao
            }
            console.log(servico_Agendamento)

            //criando o relacioanamento entre agendamento e serviços na tabela intermediaria
            const agendamentoServico = await ServicoAgendamento.create(servico_Agendamento)
            return res.redirect('/agendamento')
        } catch (error) {
            console.log(error)
            req.flash('message', 'Problemas internos')
            return res.redirect('/')
        }
    }
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
                    model: Agendamento
                },
                {
                    model: Servicos,
                },
            ]
        })
        //tranformando os agendamentos e serviços buscados em uma array e guardando em uma variavel
        const agendamento = cliente.agendamentos.map((result) => result.get({plain: true}))
        /*
        let emptyAgendamento = false
        if(agendamento.length === 0){
            emptyAgendamento = true
        }
        */
        res.render('agendamento/agendamento', {agendamento})
    }

    //este metodo vai servir para o barbeiro ver todos os agendamentos 
    static async agendamentoAll(req, res){
        if(!req.user.id){
            return res.redirect('/login')
        }
        try {
            const todosAgendamentos = await Agendamento.findAll({
            include: [
                    {
                        model: Cliente,
                    },
                    {
                        model: Servicos,
                    }
                ]
            })
            //tranformando os clientes, serviços e agendamentos buscados em uma array e guardando em uma variavel
            const agendamentoAll = todosAgendamentos.map((result) => result.get({plain: true}))
            return res.render('admin/agendamentosAll', {agendamentoAll})
        } catch (error) {
            console.log(error)
            req.flash('message', 'Erro interno')
            return res.redirect('/')
        }
    }
    /* método para usuario cancelar o agendamento
    static async cancelaAgendamento(req, res){

    }*/

    /* método para o barbeiro mudar o status do serviço
    static async servicoConcluido(req, res){
        
    }*/
}