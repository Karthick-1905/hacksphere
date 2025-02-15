const mongoose = require('mongoose')
const { app } = require('./app.js');
const { PORT,MONGODB_URI } = require('./utils/keys.js');
const { dbConnect } = require('./db/index.js');

const start = async() => {
    try {
        const connectInstance  = await mongoose.connect(MONGODB_URI);
        console.log(`Connected To the Database ${connectInstance.connection.host}`)
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        throw new Error(error)
    }
}


start()