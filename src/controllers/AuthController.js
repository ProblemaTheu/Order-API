import User from "../models/User.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import * as dotenv from "dotenv"

dotenv.config();

const secret = process.env.JWT_SECRET

//função de login
const login = async (req, res) => {
    try {
        validateJson(req.body)
        if(!validateEmailRegex(req.body.email)){
            return res.status(400).json({ message: "E-mail invalido" });
        }
        const foundUser = await User.findOne({ email: req.body.email });

        if (!foundUser) {
            return res.status(400).json({ message: "Usuário não encontrado" });
        }

        const validatePassword = bcrypt.compareSync(req.body.password, foundUser.password);

        if (!validatePassword) {
            return res.status(400).json({ message: "Usuário não autorizado" });
        }

        const token = jwt.sign({ id: foundUser._id, name: foundUser.name }, secret, { expiresIn: '1h' });

        res.status(200).json({ message: "Login realizado com sucesso", data: { token } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//função de criar usuario no db
const createUser = async (req, res) => {
    try {
        validateJson(req.body);
        if(!validateEmailRegex(req.body.email)){
            return res.status(400).json({ message: "E-mail invalido" });
        }
        const foundUser = await User.findOne({ email: req.body.email });


        if (foundUser) {
            return res.status(400).json({ message: "Usuário já existe" });
        }

        const hashedPassword = bcrypt.hashSync(req.body.password, 10);
        req.body.password = hashedPassword;
        await User.create(req.body);
        res.status(200).json({ message: "Conta registrada com sucesso, faça login para gerar seu token"});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

//função de verificar token
const verifyToken = (req, res, next) => {
    const tokenHeader = req.headers["authorization"];
    const token = tokenHeader && tokenHeader.split(" ")[1];

    if(!token){
        return res.status(400).json({ message: "Usuário não autorizado" });
    }

    try {
        jwt.verify(token, secret);
        next();
        
    } catch (error) {
        res.status(500).json({ message: "Token não é válido" })
    }
}

//função de validar json (se o usuario enviou e-mail e senha corretamente)
function validateJson(data) {
    if (typeof data !== 'object' || data === null) {
        throw new Error("Input deve ser um objeto JSON válido");
    }

    const requiredParams = ['email', 'password'];
    for (const param of requiredParams) {
        if (!data.hasOwnProperty(param)) {
            throw new Error(`O parâmetro '${param}' está faltando`);
        }
    }

    return true;
}

//função de regEx para verificar o email segue os padrões de example@email.post
function validateEmailRegex(data){
    return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(data)
}

export default {
    login,
    verifyToken,
    createUser
}