const uuid = require('uuid')
const path = require('path');
const { ApiError } = require("../../middleware/errorHandlerMiddleware")
const {Item, BasketItem} = require("../../models/model")
const AWS = require("aws-sdk");

class itemController{

	

	async create (req, res, next){
		try{
			const files = req.files;
			const {carId , ...data} = req.body;
			if (!files){
				return next(ApiError.userError("нет файла с картинкой"))
			}
			const s3 = new AWS.S3()
			const {img} = files;
			const fileName = uuid.v4() + ".jpg";
			const some = await s3.putObject({
				Body: img,
				Bucket: process.env.BUCKET_NAME,
        Key: "static/" + fileName,
			})
			const ids = JSON.parse(carId)
			const item = await Item.create({...data, img: fileName, carId: ids});
			return res.json(item);
		}
		catch(e){
			console.log(e);
			return next(ApiError.userError(e.messadge))
		}
	}
	async delet (req, res, next){
		try{
			const {id} = req.body
			const item = await Item.findOne({where: {id}});
			const basketItems = await BasketItem.findAll({where: {ItemId: id}})
			if (basketItems.length > 0)
			{
				basketItems.forEach(async (el) => await el.destroy());
			}
			if (item){
				await item.destroy();
			}
			else
			{
				return next(ApiError.userError("товара с таким ID не существует"))
			}
			return res.json({});
		}
		catch(e){
				return next(ApiError.userError(e.messadge))
		}
	}
	async getOne (req, res, next){
		try{
			const {id} = req.query
			const item = await Item.findOne({where: {id}});
			if (!item){
				return next(ApiError.userError("товара с таким ID не существует"))
			}
			const s3 = new AWS.S3()
			const file = await s3.getObject({
				Bucket: process.env.BUCKET_NAME,
				Key: "static/" + item.img,
			}).promise()
			item.file = file;
			return res.json(item);
		}
		catch(e){
			console.log(e);
			return next(ApiError.userError(e.messadge))
		}
	}
	async getAll (req, res, next){
		try{
			const limit = req.query?.limit ?? 8;
			const page = req.query?.page ?? 0;
			const offset = limit * page;
			const arrOfItems = await Item.findAll({limit, offset});
			arrOfItems.sort((a, b) => {return a.id > b.id ? 1 : -1});
			return res.json(arrOfItems);
		}
		catch(e){
			return next(ApiError.userError(e.messadge))
		}
	}

	async getCount (req, res, next){
		try{
			const arrOfItems = await Item.findAll();
			return res.json(arrOfItems.length);
		}
		catch(e){
			return next(ApiError.userError(e.messadge))
		}
	}

	async changeItemData (req, res, next){
		try{
			const body = req.body
			const item = await Item.findOne({where: {id: body.id}});
			if (!item){
				return next(ApiError.userError("товара с таким ID не существует"))
			}
			if(body.hasOwnProperty("name"))
			{
				let name = body.name
				await item.update({name })
			}else if(body.hasOwnProperty("price"))
			{
				let price = body.price
				await item.update({price })
			}else if(body.hasOwnProperty("restCount"))
			{
				let restCount = body.restCount
				await item.update({restCount })
			}
			return res.json(item);
		}
		catch(e){
			return next(ApiError.userError(e.messadge))
		}
	}
}

module.exports = new itemController();