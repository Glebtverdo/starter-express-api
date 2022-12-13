const Router = require('express');
const router = new Router();
const usersRouter = require('./users');
const BasketItemRouter = require('./basketItem')
const BasketRouter = require('./basket')
const ItemRouter = require('./item');
const CarRouter  = require('./car');
const CarTypeRouter  = require('./cartype');

router.use("/user", usersRouter);
router.use("/basketitem", BasketItemRouter);
router.use("/basket", BasketRouter);
router.use("/item", ItemRouter);
router.use("/car", CarRouter)
router.use("/cartype", CarTypeRouter)

module.exports = router;