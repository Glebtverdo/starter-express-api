const uuid = require('uuid')
const path = require('path');
const { ApiError } = require("../../middleware/errorHandlerMiddleware")
const {Item, BasketItem} = require("../../models/model")
const supabase = require('../../supabase')
const fs = require('fs')

class itemController{

	async create (req, res, next){
		try{
			const files = req.files;
			// console.log(req);
			console.log(req.files);
			const {carId , ...data} = req.body;
			if (!files){
				return next(ApiError.userError("нет файла с картинкой"))
			}
			const {img} = files;
			const fileName = uuid.v4() + ".jpg";
			const some  = await new Promise((resolve, reject) => {
					fs.writeFile(fileName, img.data, (err) => {
						err ? reject(err) : resolve("success")
			})})
			console.log(some);
			img.mv(path.resolve(__dirname, '../../', 'static', fileName));
			// const some = new Buffer( img, 'binary').toString('base64');
			// console.log(some);
		 	// const { fileData, error } = await supabase.storage
			//  .from(process.env.BUCKET_NAME)
			//  .upload(fileName, arrBuf)
			// console.log(error);
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