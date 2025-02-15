const mongoose = require('mongoose')
const {MONGODB_URI} = require('../utils/keys.js')

const dbConnect =  async() =>{
    try {
        const connectInstance  = await mongoose.connect(MONGODB_URI);
        console.log(`Connected To the Database ${connectInstance.connection.host}`)
    } catch (error) {
        throw new Error(error)
    }
}


module.exports = dbConnect

