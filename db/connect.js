const mongoose = require('mongoose');

const connectToDatabase = async(url) => {
    try {
       return await mongoose.connect(url);
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}

module.exports = {connectToDatabase};