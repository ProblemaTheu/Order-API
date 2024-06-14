import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

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