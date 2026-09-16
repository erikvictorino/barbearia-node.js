import Servico from '../models/Servicos.js'

export default class servicoController{

    static addServico(req, res){
        res.render('admin/addServico')
    }

    static async addServicoPost(req, res){
        const data = {
            nome: req.body.nome,
            preco: req.body.preco,
            image: req.file ? req.file.filename : null
        }

        if(!data.nome || !data.preco || !data.image){
            req.flash('message', 'Preencha nome, preço e imagem do serviço')
            return res.redirect('/addServico')
        }

        try {
            await Servico.create(data)
            req.flash('message', 'Serviço adicionado com sucesso')
            return res.redirect('/')
        } catch (error) {
            console.log('Erro ao adicionar serviço:', error.message)
            req.flash('message', 'Erro ao adicionar serviço')
            return res.redirect('/addServico')
        }
    }

    static async editServico(req, res){
        const id = req.params.id
        const servico = await Servico.findOne({ raw: true, where: { id: id } })

        if(!servico){
            req.flash('message', 'Serviço não encontrado')
            return res.redirect('/')
        }

        return res.render('admin/editServico', { servico })
    }

    static async editServicoPost(req, res){
        const id = req.body.id

        if(!id){
            req.flash('message', 'Serviço inválido')
            return res.redirect('/')
        }

        const data = {
            nome: req.body.nome,
            preco: req.body.preco,
        }

        if(req.file){
            data.image = req.file.filename
        }

        try {
            await Servico.update(data, { where: { id: id } })
            req.flash('message', 'Serviço atualizado com sucesso')
            return res.redirect('/')
        } catch (error) {
            console.log('Erro ao atualizar serviço:', error.message)
            req.flash('message', 'Erro ao atualizar serviço')
            return res.redirect('/')
        }
    }

    static async deleteServico(req, res){
        const id = req.body.id

        try {
            await Servico.destroy({ where: { id: id } })
            req.flash('message', 'Serviço excluido com sucesso')
            return res.redirect('/')
        } catch (error) {
            console.log('Erro ao excluir serviço:', error.message)
            req.flash('message', 'Erro ao excluir serviço')
            return res.redirect('/')
        }
    }
}
