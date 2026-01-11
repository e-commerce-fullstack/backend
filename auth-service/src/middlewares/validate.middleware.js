import jwt from 'jsonwebtoken'
import userModel from '../database/models/user.model.js'

/**
 * Middleware to protect routes based on authentication and roles.
 * @param {string} requiredRole - Optional role required to access the route (e.g., 'admin').
 */

export const adminRoute = (requiredRole) =>{
    return async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization

            if(!authHeader || !authHeader.startsWith("Bearer ")){
                return res.status(401).json({message: "Unauthorized: no token provided"})
            }

            // extract and verification
            const token = authHeader.split(" ")[1]
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)


            const foundUser = await userModel.findById(decoded.id || decoded._id)

            if(!foundUser){
                return res.status(401).json({message: "Unauthorized: user not found or deleted"})
            }

            if(requiredRole && foundUser.role !== requiredRole){
                console.log(`Access denied for user ${foundUser.email}. Required: ${requiredRole}, Found: ${foundUser.role}`);
                return res.status(403).json({message: "Don't have permission to access admin panel"})
                
            }

            req.user = foundUser;

            next()
        } catch (err) {
            console.error('Auth Middleware Error ', err.message);

            if(err.name === 'TokenExpiredError'){
                return res.status(401).json({message: "Token expired"})
            }

            return res.status(401).json({message: "Invalid token"})
            
        }
    }
}