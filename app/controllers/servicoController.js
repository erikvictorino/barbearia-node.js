import express from "express";
import Servico from '../models/Servicos.js'

export default class servicoController{
    static addServico(req, res){
        res.render('admin/addServico')
    }



    static editServico(req, res){
        res.render('admin/editServico')
    }

}
