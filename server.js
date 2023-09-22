const express = require('express');
const connectDatabase = require('./config/database');
const AllRouters = require('./routers/commonRouter');
const app = express();
const cors = require('cors')
require('dotenv').config();
const errorMiddileware = require('./middilewares/error')
const cookieParser = require('cookie-parser')
connectDatabase();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(cors())
app.use("/", AllRouters)

app.use(errorMiddileware)

const server = app.listen(process.env.PORT, () => {
    console.log(`Server Listening to the Port ${process.env.PORT} in ${process.env.NODE_ENV}`)
});

process.on('unhandledRejection', (err) => {
    console.log(`Error : ${err.message}`);
    console.log("Shutting the server due to unhandled Rejectionn Error");
    server.close(() => {
        process.exit(1);
    })
})
process.on('uncaughtException', (err) => {
    console.log(`Error ${err.message}`);
    console.log("Shutting the server due to uncaughtException Error");
    server.close(() => {
        process.exit(1);
    })
})

