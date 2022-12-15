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
const AWS = require("aws-sdk");
const s3 = new AWS.S3()
const bodyParser = require('body-parser');

const Port = process.env.PORT || 8080

app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/', router)
app.use(ErrorHandler)


app.use(bodyParser.json())
app.get('statix/*', async (req,res) => {
  let filename = req.path.slice(1)
	console.log(filename);
  try {
    let s3File = await s3.getObject({
      Bucket: process.env.BUCKET,
      Key: filename,
    }).promise()

    res.set('Content-type', s3File.ContentType)
    res.send(s3File.Body.toString()).end()
  } catch (error) {
    if (error.code === 'NoSuchKey') {
      console.log(`No such key ${filename}`)
      res.sendStatus(404).end()
    } else {
      console.log(error)
      res.sendStatus(500).end()
    }
  }
})

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