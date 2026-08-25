import jwt from 'jsonwebtoken'
import Cliente from '../models/Cliente.js'

async function checkUser (req, res, next){
    res.locals.user = null
    const token = req.cookies.token

    if(token){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            const user = await Cliente.findOne({
                where: {
                    id: decoded.id
                }
            })
            if(! user){
                res.clearCookie('token')
                return next()
            }
            res.locals.user = user
            req.user = user
        } catch (error) {
            console.log(error.message)
        }
    }
    return next()
}
export default checkUser