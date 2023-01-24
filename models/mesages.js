import { Sequelize } from 'sequelize';
import configDb from "../config/db.js"

const Mesage = configDb.define('Mesage', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
    },
    chatId: {
        type: Sequelize.INTEGER,
    },
    question: {
        type: Sequelize.STRING,
    },
    response: {
        type: Sequelize.STRING,
    },
    createdAt: {
        type: Sequelize.DATE,
    },
    updatedAt: {
        type: Sequelize.DATE,
    }
});

export default Mesage;