import express from "express";
import Servico from '../models/Servicos.js'

export default class servicoController{
    static addServico(req, res){
        res.render('admin/addServico')
    }



    static async editServico(req, res){
        const id = req.params.id
        const servico = await Servico.findOne({raw: true, where: {id:id}})
        res.render('admin/editServico', {servico})
    }

    static async editServicoPost(req, res){
        const {id, nome, preco, image} = req.body
        const data = {nome, preco, image}
        try {
            const servico = await Servico.update(data,{where: {id}})
            req.flash('message', 'Serviço atualizado com sucesso')
            res.redirect('/')
        } catch (error) {
            console.log(error)
        }
    }

}
