"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRole = exports.auth = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const auth = (req, res, next) => {
    let token = req.header("Authorization");
    if (!token) {
        res.status(401).json("Not Authorized");
        return;
    }
    try {
        //console.log("Token: "+token);
        token = token.replace("Bearer ", "");
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "secret");
        req.body.loggedUser = decoded; //Guardo el usuario decodificado en el body de la request 
        console.log(decoded);
        req.params.id = decoded.user.id;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            res.status(401).json("Token Expired");
            return;
        }
        res.status(401).json("Not Authorized");
    }
};
exports.auth = auth;
const authorizeRole = (requiredRole) => {
    return (req, res, next) => {
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
    };
};
exports.authorizeRole = authorizeRole;
