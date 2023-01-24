import { Sequelize } from "sequelize"
import * as dotenv from 'dotenv'

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASS, {
    host: process.env.SERVER_NAME,
    dialect: 'mysql',
    dialectOptions: { useUTC: false }, timezone: "-03:00"
})

sequelize.authenticate()
    .then(function () {
        console.log("Conexão com banco de dados com sucesso")
    }).catch(function () {
        console.log('Conexao com banco de dados falhou')
    })

export default sequelize;