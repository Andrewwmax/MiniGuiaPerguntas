const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Pergunta = new Schema({
    titulo:{
        type: String,
        require: true
        // default: "Nume do Fulano"
    },
    descricao: {
        type: String,
        require: true
    }
})

mongoose.model('pergunta', Pergunta)