//importando operadores para consultas no banco de dados
import { Op } from "sequelize"
import Agendamento from '../models/Agendamento.js'
import Cliente from '../models/Cliente.js'
import Servicos from '../models/Servicos.js'
import ServicoAgendamento from '../models/ServicoAgendamento.js'
import authorizeRoles from '../middlewares/checkFuncao.js'

export default class AgendamentoController {
    static async servicos(req, res) {
        try {
            const servicos = await Servicos.findAll({ raw: true })
            return res.render('agendamento/servico', { servicos })
        } catch (error) {
            console.log(error)
        }
    }
    //este metodo vai servir para criar os agendamentos no banco
    static async agendamentoPost(req, res) {
        if (!req.user.id) {
            return res.redirect('/')
        }

        try {
            //pedir para o fronte enviar um array de Ids
            //pegando o array de ids dos serviços que o usuario escolheu
            let servicosIds = req.body.servicosIds
            //validação caso array venha vazio
            if (!Array.isArray(servicosIds) || servicosIds.length === 0) {
                req.flash('message', 'Escolha o serviço desejado')
                return res.redirect('/')
            }

            //criando um novo array apenas com ids unicos
            //ex [1, 3, 3, 5] -> [1, 3, 5]
            const idsUnicos = new Set(servicosIds)

            //se o tamanho dos array forem iguais, não existe id duplicado
            if (servicosIds.length === idsUnicos.size) {
                //procurando os serviços escolhidos
                const servicos = await Servicos.findAll({
                    //filtrando serviços pelos ids
                    where: {
                        id: {
                            //pegando os serviços cujo os ids estejam no array servicosIds
                            [Op.in]: servicosIds
                        }
                    }
                })
                //checando se o serviço escolhido existe no banco
                //se o tamanho de idsUnicos for diferente do tamanho servicos 
                if (idsUnicos.size !== servicos.length) {
                    req.flash('message', 'O(s) serviço(s) escolhido não existe')
                    return res.redirect('/')
                }

                let duracaoNovo = 0
                //looping para somar a duração dos serviços
                for (let i = 0; i < servicos.length; i++) {
                    duracaoNovo = duracaoNovo + servicos[i].duracao
                }
                //separando as horas dos minutos
                const horaInicio = req.body.hora.split(':')
                //convertendo para o tipo numero
                const horas = Number(horaInicio[0])
                //convertendo para o tipo numero
                const minutos = Number(horaInicio[1])
                //calculo de inicio do corte em minutos
                const inicioNovoEmMinutos = (horas * 60) + minutos
                //calculando horario de fim do serviço
                const fimNovoEmMinutos = duracaoNovo + inicioNovoEmMinutos
                //horario de fechamento da barbearia
                const horarioFechamentoEmMinutos = (18 * 60) + 30
                //verificando se o tempo de serviço não ultrapassa o horario de fechamento
                if (fimNovoEmMinutos > horarioFechamentoEmMinutos) {
                    req.flash('message', 'Horario escolhido ultrapassa o horario de atendimento')
                    return res.redirect('/')
                }

                //pegando os agendamentos da data que o usuario escolheu o serviço 
                const agendamentosExistentes = await Agendamento.findAll({
                    where: {
                        data: req.body.data,
                        barbeiro_id: 1
                    }
                })
                //laço de repetição para pegar os serviços relacionados aos agendamentos de agendamentosExistentes
                for (let i = 0; i < agendamentosExistentes.length; i++) {
                    const servicoAgendamento = await ServicoAgendamento.findAll({
                        where: {
                            agendamentoId: agendamentosExistentes[i].id
                        }
                    })
                    //somando a duração dos serviços buscados
                    let duracaoExistente = 0
                    for (let i = 0; i < servicoAgendamento.length; i++) {
                        duracaoExistente = duracaoExistente + servicoAgendamento[i].duracao
                    }

                    //pegando o horario de inicio de cada serviço e calculando o termino

                    const horaAgendamento = agendamentosExistentes[i].hora.split(':')
                    //convertendo para o tipo numero
                    const hora = Number(horaAgendamento[0])
                    //convertendo para o tipo numero
                    const minuto = Number(horaAgendamento[1])
                    //calculo de inicio do corte em minutos
                    const inicioExistente = (hora * 60) + minuto
                    //variavel para guardar o horario fim do agendamento existente
                    const fimExistente = inicioExistente + duracaoExistente
                    // Verifica se o início do novo agendamento é anterior ao fim do agendamento existente
                    // E se o fim do novo agendamento é posterior ao início do agendamento existente.
                    // Se ambas as condições forem verdadeiras, existe conflito de horário.
                    if (inicioNovoEmMinutos < fimExistente && fimNovoEmMinutos > inicioExistente) {
                        req.flash('message', 'O horário escolhido já está ocupado')
                        return res.redirect('/')
                    }
                }

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

                //laço de repetição para criar
                for (let i = 0; i < servicos.length; i++) {//criando objeto com os dados do serviço escolhido
                    const servico_Agendamento = {
                        //pegando o id do agendamento que acabou de ser criado
                        agendamentoId: criaAgendamento.id,
                        servicoId: servicos[i].id,
                        preco: servicos[i].preco,
                        duracao: servicos[i].duracao,
                    }
                    //criando o relacioanamento entre agendamento e serviços na tabela intermediaria
                    const agendamentoServico = await ServicoAgendamento.create(servico_Agendamento)
                }

                //se for adm vai ser redirecionado para ver todos os agendamentos
                if (authorizeRoles("admin")) {
                    return res.redirect('/agendamentosAll')
                }
                //caso seja user normal, vai ver os agendamentos correspondente a seu id
                return res.redirect('/agendamento')
            }
            //se os tamanhos forem diferentes interrompe processo
            else {
                req.flash('message', "Serviços duplicados")
                return res.redirect('/')
            }
        } catch (error) {
            console.log(error)
            req.flash('message', 'Problemas internos')
            return res.redirect('/')
        }
    }

    static async dashboard(req, res) {
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
            include: [
                {
                    model: Agendamento,
                    include: [
                        { model: Servicos, }
                    ],
                }
            ]
        })
        //tranformando os agendamentos e serviços buscados em uma array e guardando em uma variavel
        const agendamento = cliente.agendamentos.map((result) => result.get({ plain: true }))
        /*
        let emptyAgendamento = false
        if(agendamento.length === 0){
            emptyAgendamento = true
        }
        */
        res.render('agendamento/agendamento', { agendamento })
    }

    //este metodo vai servir para o barbeiro ver todos os agendamentos 
    static async agendamentoAll(req, res) {
        if (!req.user.id) {
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
            const agendamentoAll = todosAgendamentos.map((result) => result.get({ plain: true }))
            return res.render('admin/agendamentosAll', { agendamentoAll })
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