import express from "express";
import Servico from '../models/Servicos.js'

export default class servicoController{
    static addServico(req, res){
        res.render('admin/addServico')
    }



    static async editServico(req, res){
        const id = req.params.id
        const servico = await Servico.findOne({raw: true, where: {id:id}})
        console.log(servico)
        res.render('admin/editServico', {servico})
    }

}
