import Order from '../models/Order.js';

class OrderService {
    //funcão para validar se o pedido tem os parametros corretos e se eles são do tipo correto
    static validateOrderData(orderData) {
        if (!orderData.numeroPedido || typeof orderData.numeroPedido !== 'string') {
            throw new Error('Número do pedido é inválido, é necessário que seja uma string');
        }

        if (typeof orderData.valorTotal !== 'number' || orderData.valorTotal <= 0) {
            throw new Error('Valor total é inválido, é necessário que seja um número');
        }

        if (!orderData.numeroPedido || typeof orderData.numeroPedido !== 'string') {
            throw new Error('Número do pedido é inválido, é necessário que seja uma string');
        }

        if (!orderData.dataCriacao|| typeof orderData.dataCriacao !== 'string') {
            throw new Error('Data de criação do pedido é inválido, é necessário que seja uma string (preferencialmente em um modelo de objeto Data');
        }

        if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
            throw new Error('Items são inválidos, é necessário conter os parametro idItem, quantidadeItem e valorItem');
        }

        orderData.items.forEach(item => {
            if (!item.idItem || isNaN(Number(item.idItem)) || Number(item.idItem) <= 0) {
                throw new Error('ID do item é inválido, é ncessário que seja um número ou uma string numérica');
            }

            if (!Number.isInteger(item.quantidadeItem) || item.quantidadeItem <= 0) {
                throw new Error('Quantidade do item é inválida, é necessário que seja um número inteiro');
            }

            if (typeof item.valorItem !== 'number' || item.valorItem <= 0) {
                throw new Error('Valor do item é inválido, é necessário que seja um número');
            }
        });

        return true;
    }

    //função para mapear o pedido enviado e deixa-lo com os parametros aceitaveis pelo schema do banco de dados
    static mapOrderData(orderData) {
        return {
            orderId: orderData.numeroPedido,
            value: orderData.valorTotal,
            creationDate: new Date(orderData.dataCriacao),
            items: orderData.items.map(item => ({
                productId: Number(item.idItem),
                quantity: item.quantidadeItem,
                price: item.valorItem
            }))
        };
    }
    
    //função para checkar se o pedido já existe no banco de dados (principalmente usado na função de create e update)
    static async checkIfOrderExistsById(orderId) {
        const order = await Order.findOne({ "orderId": orderId });
        return !!order;
    }

    //função para criar (post) um pedido
    static async createOrder(order) {
        try {
            if (await this.checkIfOrderExistsById(order.numeroPedido)) {
                throw new Error('Pedido já existe');
            }
            this.validateOrderData(order);
            const mappedOrder = this.mapOrderData(order);
            const newOrder = await Order.create(mappedOrder);
            return newOrder;
        } catch (error) {
            throw new Error('Erro ao criar o pedido: ' + error.message);
        }
    }

    //função para visualizar um pedido com base no id passado pelo usuario
    static async getOrderById(orderId) {
        const order = await Order.findOne({ "orderId": orderId });
        if (!order) {
            throw new Error('Pedido não encontrado');
        }
        return order;
    }

    //função para listar todos os pedidos do banco de dados
    static async listOrders() {
        return await Order.find();
    }

    //função para atualizar (put) um pedido que já esta no banco de dados
    static async updateOrder(orderId, newData) {
        const orderExists = await this.checkIfOrderExistsById(orderId);
        if (!orderExists) {
            throw new Error('Pedido não existe');
        }

        if(Object.keys(newData).length === 0){
            throw new Error("Nenhum dado para atualização foi fornecido")
        }

        await this.validateOrderData(newData);
        const mappedOrder = this.mapOrderData(newData);

        return await Order.findOneAndUpdate(
            { "orderId": orderId },
            mappedOrder,
            { new: true, runValidators: true }
        );
    }

    //função para deletar um pedido no banco de dados
    static async deleteOrder(orderId) {
        const orderExists = await this.checkIfOrderExistsById(orderId);
        if (!orderExists) {
            throw new Error('Pedido não existe');
        }

        return await Order.findOneAndDelete({ "orderId": orderId });
    }
}

export default OrderService;
