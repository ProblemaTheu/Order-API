import mongoose from "mongoose";
import dotenv from "dotenv";

//biblioteca de dotenv para dados de login no DB e criptografia
dotenv.config();

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

//conexão com o mongodb
const connect = () => {
    mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.kdjcjsn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);

    const connection = mongoose.connection;

    connection.on("error", () => {
        console.log("Erro ao conectar com o MongoDB");
    });

    connection.once("open", () => {
        console.log("Conectado ao MongoDB com sucesso");
    });
};

export default connect;