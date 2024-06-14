import express from "express";
import connect from "./src/database/connection.js";
import OrderService from "./src/services/OrderService.js";
import auth from "./src/controllers/AuthController.js";

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;
connect();

//Fazer login e requisitar token
app.post("/login", auth.login)

//Criar um usuario no db
app.post("/register", auth.createUser)

//Criar um pedido
app.post("/order", auth.verifyToken, async (req, res) => {
    try {
        const newOrder = await OrderService.createOrder(req.body);
        return res.status(201).json({message: "Pedido criado com sucesso", data: newOrder});
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

//Listar todos os pedidos existentes
app.get("/order/list", auth.verifyToken, async (req, res) => {
    try {
        const orders = await OrderService.listOrders();
        return res.json(orders);
    } catch (error) {
        return res.json({ message: error.message });
    }
});

//Mostrar um pedido com base no id enviado
app.get("/order/:id", auth.verifyToken, async (req, res) => {
    try {
        const order = await OrderService.getOrderById(req.params.id);
        return res.json(order);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    };
});

//Atualizar um pedido com base no id enviado
app.put("/order/:id", auth.verifyToken, async (req, res) => {
    try {
        const updatedOrder = await OrderService.updateOrder(req.params.id, req.body);
        return res.status(201).json({message: "Pedido atualizado com sucesso", data: updatedOrder});;
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

//Deletar um pedido com base no id
app.delete("/order/:id", auth.verifyToken, async (req, res) => {
    try {
        await OrderService.deleteOrder(req.params.id);
        return res.status(200).json({ message: "Pedido deletado com sucesso" });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
});

//Iniciar o servidor na porta especificada
app.listen(port, () => {
    console.log(`Servidor online na porta ${port}`);
});
