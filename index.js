require("dotenv").config()
const express = require("express");
const sequelize = require("./db");
const fileUpload = require('express-fileupload')
const cors = require("cors");
const path = require('path');
const models = require("./models/model");
const router = require("./routers/index");
const {ErrorHandler} = require("./middleware/errorHandlerMiddleware");
const app = express();

const Port = process.env.PORT || 8080

app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/', router)
app.use(ErrorHandler)

app.get('/', (req, res) => res.json("hellow world"))

const start = async () => {
	try{
		await sequelize.authenticate();
		await sequelize.sync();
		app.listen(Port, () => console.log(`server started on port ${Port}`));
	}
	catch(e){
		console.log(e);
	}
}

start()