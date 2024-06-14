import mongoose from "mongoose";

//Schema de items
const itemSchema = new mongoose.Schema({
    productId: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

//Schema da order
const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    value: {
        type: Number,
        required: true
    },
    creationDate: {
        type: Date,
        required: true,
        default: Date.now()
    },
    items: {
        type: [itemSchema],
        required: true
    }
});

//Criação do modelo baseado nos schemas criados
const Order = mongoose.model('Order', orderSchema);

export default Order