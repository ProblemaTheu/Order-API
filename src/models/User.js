import mongoose from "mongoose";

//Schema de usuario
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },

});


//Criação do modelo baseado nos schemas criados
const User = mongoose.model('User', userSchema);

export default User