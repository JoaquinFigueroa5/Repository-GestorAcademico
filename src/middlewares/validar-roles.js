export const tieneRole = (...roles) => {
    return (req, res, next) => {
        if(!req.usuario){
            return res.status(500).json({
                success: false,
                msg: 'You do wanna a verificate a role without a token init'
            })
        }
        if(!roles.includes(req.usuario.role)){
            return res.status(401).json({
                success: false,
                msg: `User dont have an autorized, it have a role ${req.usuario.role}, the roles autorized are ${roles}`
            })
        }

        next();
        
    }
}