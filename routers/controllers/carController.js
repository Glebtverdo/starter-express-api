const {Car} = require("../../models/model");
const {ApiError} = require("../../middleware/errorHandlerMiddleware");
const uuid = require('uuid');
const path = require('path');

class carController{
	async getAllCars(_, res, next)
	{
		try
		{
			const cars = await Car.findAll();
			return res.json(cars);
		}
		catch(e)
		{
			return next(ApiError.userError(e.messadge));
		}
	}

	async getAllItems(req, res, next)
	{
		try
		{
			const CarId = req.query.id;
			const items = await Item.findAll({where: {CarId}});
			return res.json(items);
		}
		catch(e)
		{
			return next(ApiError.userError(e.messadge));
		}
	}

  async create (req, res, next){
		try{
			const files = req.files;
			const data = req.body;
			if (!files){
				return next(ApiError.userError("нет файла с картинкой"))
			}
			const {img} = files;
      let fileName = uuid.v4() + ".jpg";
			await supabase.storage
			 .from(process.env.BUCKET_NAME)
			 .upload(fileName, img.data, {
    		contentType: img.mimetype
 			})
			const car = await Car.create({...data, img: fileName});
			return res.json(car);
		}
		catch(e){
			return next(ApiError.userError(e.messadge))
		}
	}
}

module.exports = new carController();