const {CarType, Car} = require("../../models/model");
const {ApiError} = require("../../middleware/errorHandlerMiddleware");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class carTypeController{
	async getCarsByIds(req, res, next)
	{
		try
		{
			const CarTypeId = req.body.id;
			const cars = await Car.findAll({where: {
				CarTypeId: {
					[Op.or]: CarTypeId
				}
			}});
			return res.json(cars);
		}
		catch(e)
		{
			console.log(e);
			return next(ApiError.userError(e.messadge));
		}
	}

	async getAllCarTypes(_, res, next)
	{
		try
		{
			const carTypes = await CarType.findAll();
			return res.json(carTypes);
		}
		catch(e)
		{
			return next(ApiError.userError(e.messadge));
		}
	}

  async create (req, res, next){
		try{
			const data = req.body;
			const carType = await CarType.create({...data});
			return res.json(carType);
		}
		catch(e){
			return next(ApiError.userError(e.messadge))
		}
	}
}

module.exports = new carTypeController();