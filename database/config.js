const mongoose = require('mongoose');
require('dotenv').config();

const dbConnection = async () => {
    await mongoose.connect( process.env.DB_CNN, {
        useNewUrlParser: true, 
        useUnifiedTopology: true
    });

    console.log('Db OnLine');

    try {

    } catch (error) {
        console.log();
        throw new Error('Error a la hora de iniciar la BD ver logs');
    }
}

module.exports = {
    dbConnection
}