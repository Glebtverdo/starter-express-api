const Router = require('express');
const CheckAuthicationMiddleware = require('../middleware/checkAuthicationMiddleware');
const router = new Router();
const bascketItemController = require("./controllers/bascketItemController");

router.post("/newitem", CheckAuthicationMiddleware, bascketItemController.create);
router.post("/incrementcnt", CheckAuthicationMiddleware, bascketItemController.incrementCnt);
router.post("/decrementcnt", CheckAuthicationMiddleware, bascketItemController.decrementCnt);
router.post("/changecnt", CheckAuthicationMiddleware, bascketItemController.changeCnt);
router.post("/deletone", CheckAuthicationMiddleware, bascketItemController.deletOne);
router.get("/getone", CheckAuthicationMiddleware, bascketItemController.getOne);
router.post("/deletAll", CheckAuthicationMiddleware, bascketItemController.deletAll);
router.get("/getall", CheckAuthicationMiddleware, bascketItemController.getAll);

module.exports = router;