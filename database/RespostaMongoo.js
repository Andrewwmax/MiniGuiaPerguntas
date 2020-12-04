const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Resposta = new Schema({
    corpo:{
        type: String,
        require: true
        // default: "Nume do Fulano"
    },
    perguntaId: {
        type: Number,
        require: true
    }
})

mongoose.model('resposta', Resposta)