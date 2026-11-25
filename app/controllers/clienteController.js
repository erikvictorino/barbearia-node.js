import Cliente from '../models/Cliente.js'

export default class clienteController{
    static async clientesAll(req, res){
        try {
            const clientesAll = await Cliente.findAll({raw: true})
            return res.render('admin/clientesAll', {clientesAll})
        } catch (error) {
            req.flash('message', 'Erro interno')
            return res.redirect('/')
        }
    }

}