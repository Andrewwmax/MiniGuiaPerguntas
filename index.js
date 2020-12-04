const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection = require('./database/database')
const Pergunta = require('./database/Pergunta')
const Resposta = require('./database/Resposta')
const mongoose = require('mongoose')
require('./database/PerguntaMongoo')
const PerguntaMongoo = mongoose.model('pergunta')
require('./database/RespostaMongoo')
const RespostaMongoo = mongoose.model('resposta')


connection.authenticate().then(() => {
	console.log('Conexão feita com o BD!!!')
}).catch((err) => {
	console.log('Ocorreu um erro ao conectar no Banco de dados!' + err);
})

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

mongoose.connect('mongodb://localhost/guiaperguntas', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true
}).then(() => { 
	console.log('Conectado ao Mongo DB ' + 'mongodb://localhost/guiaperguntas')
}).catch((err) => {
	console.log('Errooooooow = ' + err)
})

app.get('/', (req, res) => {
	Pergunta.findAll({raw: true, order:[
		['id','DESC']
	]}).then(perguntas => {
		res.render('index', {
			perguntas: perguntas
		})
	})
})

app.get('/perguntar', (req, res) => {
	res.render('perguntar')
})

app.post('/salvarpergunta', (req, res) => {
	var titulo = req.body.titulo
	var descricao = req.body.descricao
	Pergunta.create({
		titulo: titulo,
		descricao: descricao
	}).then(() => {
		const novaPergunta = {
			titulo: titulo,
			descricao: descricao
		}
		new PerguntaMongoo(novaPergunta).save().then(() => {
			res.redirect('/')
		}).catch(err => {
			console.log('Erro ao salvar no Mongodb = '+ err);
		})
	}).catch(err => {
		console.log('Erro ao salvar no Mysql = '+ err);
	})

})

app.get('/pergunta/:id', (req,res) => {
	var id = req.params.id
	Pergunta.findOne({
		where: {id: id}
	}).then(pergunta => {
		if(pergunta != undefined){
			Resposta.findAll({
				where: {perguntaId: pergunta.id},
				order: [['id', 'DESC']]
			}).then(respostas => { 
				res.render('pergunta', {
					pergunta: pergunta,
					respostas: respostas
				})
			})
		} else {
			res.redirect('/')
		}
	})
})

app.post('/responder', (req, res) => {
	var corpo = req.body.corpo
	var perguntaId = req.body.pergunta

	Resposta.create({
		corpo: corpo,
		perguntaId: perguntaId
	}).then(() => {
		const novaResposta = {
			corpo: corpo,
			perguntaId: perguntaId
		}
		new RespostaMongoo(novaResposta).save().then(() => {
			res.redirect(`/pergunta/${perguntaId}`)
		}).catch(err => {
			console.log('Erro ao salvar no Mongodb = '+ err);
		})
	}).catch(err => {
		console.log('Erro ao salvar no Mysql = '+ err);
	})
})

app.listen(8081,() => {
	console.log('Servidor Rodando em http://localhost:8081');
})
