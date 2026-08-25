const authorizeRoles = (...allowedRoles) =>{
    return(req, res, next) =>{
        if(!allowedRoles.includes(req.user.tipo_usuario)){
            return res.status(403).json({message: "Voce não tem permissão para acessar essa função"})
        }
        next();
    }
}
export default authorizeRoles