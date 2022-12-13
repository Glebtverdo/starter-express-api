const {Basket} = require("../../models/model");
const {ApiError} = require("../../middleware/errorHandlerMiddleware");

class basketController{
	async getOne(req, res, next)
	{
		try
		{
			const UserId = req.user.id;
			const basket = await Basket.findOne({where: {UserId}});
			return res.json({basket});
		}
		catch(e)
		{
			return next(ApiError.userError(e.messadge));
		}
	}
}

module.exports = new basketController();