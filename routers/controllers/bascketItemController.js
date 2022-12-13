const { ApiError } = require('../../middleware/errorHandlerMiddleware');
const { BasketItem, Basket, Item } = require('../../models/model');

class basketItemController{

	async getItemAndBasketItem(req){
		const basketItemId = req.body.basketItemId;
		let BasketId = undefined;
		if (!basketItemId)
		{
			BasketId = req.body.BasketId ?? (await Basket.findOne({where: {UserId: req.user.id}})).id;
		}
		const ItemId = req.body.itemId;
		const basketItem = basketItemId ? await BasketItem.findOne({where: {id: basketItemId}}) : await BasketItem.findOne({where: {ItemId, BasketId}});
		const item = ItemId ? await Item.findOne({where: {id: ItemId}}) : await Item.findOne({where: {id: basketItem.ItemId}});
		return {basketItem, item}
	}

	async create (req, res, next){
		try{
			const BasketId = req.body.BasketId ?? (await Basket.findOne({where: {UserId: req.user.id}})).id;
			const ItemId = req.body.itemId;
			const basketItem = await BasketItem.findOne({where: {ItemId, BasketId}});
			// console.log(basketItem);
			if(basketItem){
				return next(ApiError.userError("такой пердмет в корзне уже есть"))
			}
			const item = await Item.findOne({where: {id: ItemId}});
			if(item.restCount > 0)
			{
				const newBasketItem = await BasketItem.create({name: item.name, price: item.price, cnt: 1, img: item.img, BasketId, ItemId});
				await item.update({restCount: item.restCount-1});
				return res.json(newBasketItem);
			}
			else{
				return next(ApiError.userError("товара нет на складе"))
			}
		}
		catch(e){
			return next(ApiError.userError(e.messadge))
		}
		// console.log(req.user);
	}

	incrementCnt = async (req, res, next) =>{
		try{
			const {item, basketItem} = await this.getItemAndBasketItem(req);
			if(item.restCount > 0)
			{
				item.update({restCount: item.restCount - 1})
				basketItem.update({cnt: basketItem.cnt + 1})
				return res.json(basketItem);
			}
			return next(ApiError.userError("этот товар закончился на складе"))
		}
		catch(e){
			return next(ApiError.userError(e.messadge))
		}
	}

	decrementCnt = async (req, res, next) =>{
		try{
			const {item, basketItem} = await this.getItemAndBasketItem(req);
			if(basketItem.cnt - 1 == 0)
			{
				req.body.basketItemId = basketItem.id;
				return await this.deletOne(req, res, next);
			}
			else
			{
				item.update({restCount: item.restCount + 1})
				basketItem.update({cnt: basketItem.cnt - 1})
				return res.json(basketItem)
			}
		}
		catch(e){
			return next(ApiError.userError(e.messadge))
		}
	}

	deletOne = async (req, res, next) => {
		try{
			const {item, basketItem} = await this.getItemAndBasketItem(req);
			if(!basketItem){
				return next(ApiError.userError("такого пердмета нет в корзне"))
			}
			await item.update({restCount: item.restCount + basketItem.cnt});
			await basketItem.destroy();
			return res.json(basketItem);
		}
		catch(e){
			return next(ApiError.userError(e.messadge))
		}
	}

	getOne = async (req, res, next) => {
		try{
			const {id} = req.query;
			const {id: UserId} = req.user;
			const basket = await Basket.findOne({where: {UserId}})
			const basketItem = await BasketItem.findOne({where: {ItemId: id, BasketId: basket.id}});
			if(!basketItem){
				return next(ApiError.userError("такого пердмета нет в корзне"))
			}
			return res.json(basketItem);
		}
		catch(e){
			return next(ApiError.userError(e.messadge))
		}
	}

	async deletAll(req, res, next){
		try{
			const BasketId = req.body.BasketId ?? (await Basket.findOne({where: {UserId: req.user.id}})).id;
			const arrOfBasketItems = await BasketItem.findAll({where: {BasketId}});
			arrOfBasketItems.forEach( async (el) =>
			{
				const item = await Item.findOne({where: {id: el.ItemId}});
				await item.update({restCount: item.restCount + el.cnt});
				await el.destroy();
			})
			return res.json({})
		}
		catch(e){
			return next(ApiError.userError(e.messadge))
		}
	}

	async getAll (req, res, next){
		try{
			const BasketId = req.body.BasketId ?? (await Basket.findOne({where: {UserId: req.user.id}})).id;
			const arrOfBasketItems = await BasketItem.findAll({where: {BasketId}});
			arrOfBasketItems.sort((a, b) => {return a.id > b.id ? 1 : -1});
			return res.json(arrOfBasketItems)
		}
		catch(e){
			return next(ApiError.userError(e.messadge))
		}
	}

	changeCnt = async (req, res, next) => {
		try{
			const {item, basketItem} = await this.getItemAndBasketItem(req);
			const delta = req.body.delta;
			if(!basketItem){
				return next(ApiError.userError("такого пердмета нет в корзне"))
			}
			if(item.restCount + delta < 0 || basketItem.cnt - delta < 0)
			{
				return next(ApiError.userError("действие невозможно"))
			}
			await item.update({restCount: item.restCount + delta})
			await basketItem.update({cnt: basketItem.cnt - delta})
			if (basketItem.cnt === 0)
			{
				req.body.basketItemId = basketItem.id;
				return await this.deletOne(req, res, next);
			}
			return res.json(basketItem)
		}
		catch(e){
			return next(ApiError.userError(e.messadge))
		}
	}
}

module.exports = new basketItemController();