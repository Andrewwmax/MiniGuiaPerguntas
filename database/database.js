const Sequelize = require('sequelize')

const connection = new Sequelize('guiaperguntas', 'root', 'AndrewwMax', {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = connection