import Servico from '../models/Servicos.js'
import { uploadToCloudinary } from '../middlewares/upload.js'
export default class servicoController{
    static addServico(req, res){
        res.render('admin/addServico')
    }
    static async addServicoPost(req, res){
        if(!req.file){
            return res.status(400).json({sucess: false, message: "Selecione uma imagem"})
        }
        try {
            const result = await uploadToCloudinary(req.file.buffer)
            const data = {
            nome: req.body.nome, 
            preco: req.body.preco, 
            image: result.secure_url,
            duracao: req.body.duracao
        }

            const servico = await Servico.create(data)
            req.flash('message', 'Serviço adicionado com sucesso')
            res.redirect('/')
        } catch (error) {
            console.log(error)
            return res.status(500).json({message: 'Erro ao adicionar serviço'})
        }
    }

    static async editServico(req, res){
        const id = req.params.id
        const servico = await Servico.findOne({raw: true, where: {id:id}})
        res.render('admin/editServico', {servico})
    }

    static async editServicoPost(req, res){
        const id = req.body.id
        const data = {
            nome: req.body.nome,
            preco: req.body.preco,
            duracao: req.body.duracao
        }
        
        try {
            if(req.file){
                const result = await uploadToCloudinary(req.file.buffer)
                data.image = result.secure_url
        }
            const servico = await Servico.update(data,{where: {id}})
            req.flash('message', 'Serviço atualizado com sucesso')
            res.redirect('/')
        } catch (error) {
            console.log(error)
            return res.status(500).json({message: 'Erro ao atualizar serviço'})
        }
    }

    static async deleteServico(req, res){
        const id = req.body.id
        await Servico.destroy({where: {id: id}})
        req.flash('message', 'Serviço excluido com sucesso')
        res.redirect('/')
    }

}
