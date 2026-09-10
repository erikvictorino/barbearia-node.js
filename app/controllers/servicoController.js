import Servico from '../models/Servicos.js'

export default class servicoController{
    static addServico(req, res){
        res.render('admin/addServico')
    }
    static async addServicoPost(req, res){
        const data = {
            nome: req.body.nome, 
            preco: req.body.preco, 
            image: req.file.filename
        }
        console.log(data)
        try {
            const servico = await Servico.create(data)
            req.flash('message', 'Serviço adicionado com sucesso')
            res.redirect('/')
        } catch (error) {
            console.log(error)
        }
    }

    static async editServico(req, res){
        const id = req.params.id
        const servico = await Servico.findOne({raw: true, where: {id:id}})
        res.render('admin/editServico', {servico})
    }

    static async editServicoPost(req, res){
        const data = {
            nome: req.body,
            preco: req.body, 
            image: req.file.filename
        }
        try {
            const servico = await Servico.update(data,{where: {id}})
            req.flash('message', 'Serviço atualizado com sucesso')
            res.redirect('/')
        } catch (error) {
            console.log(error)
        }
    }

    static async deleteServico(req, res){
        const id = req.body.id
        await Servico.destroy({where: {id: id}})
        req.flash('message', 'Serviço excluido com sucesso')
        res.redirect('/')
    }

}
