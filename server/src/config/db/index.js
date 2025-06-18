require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

async function connect() {
    try {
        await mongoose.connect(uri);
        console.log("Connect successfuly!!!")
    } catch (error) {
        console.log("Connect failure!!!")
        console.log(error)
    }
}

module.exports = { connect }