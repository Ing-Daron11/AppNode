import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";

export const auth = (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined =  req.header("Authorization"); 

    if(!token){
        res.status(401).json("Not Authorized");
        return;
    }

    try {
        //console.log("Token: "+token);
        token = token.replace("Bearer ", "");
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "secret");
        req.body.loggedUser = decoded; //Guardo el usuario decodificado en el body de la request 
        // console.log(decoded);
        // console.log("Authenticated User:", req.body.loggedUser);
        // req.params.id = decoded.user.id;
        // console.log(req.params.id)
        next();
    } catch (error) {
        if (error instanceof TokenExpiredError){
            res.status(401).json("Token Expired");
            return;
        }
        res.status(401).json("Not Authorized");
    }


}

export const authorizeRole = (requiredRole: string) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const user = req.body.loggedUser.user;
        console.log("Usuario autenticado:", req.body.loggedUser);

        if (!user) {
            res.status(401).json("Unauthorized");
            return;
        }

        if (user.role !== requiredRole) {
            console.log(`Intento de acceso con rol: ${user.role}, requerido: ${requiredRole}`);
            res.status(403).json("Forbidden: Insufficient permissions");
            return;
        }

        next(); //Si llega hasta acá, el usuario está autorizado
    }
}