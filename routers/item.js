const Router = require('express');
const router = new Router();
const itemController = require("./controllers/itemController");
const checkAuthicationMiddleware = require('../middleware/checkAuthicationMiddleware');
const checkIsAdminMiddleware = require('../middleware/checkIsAdminMiddleware');

router.post("/newitem", checkAuthicationMiddleware, checkIsAdminMiddleware, itemController.create);
router.post("/delet", checkAuthicationMiddleware, checkIsAdminMiddleware, itemController.delet);
router.post("/changeitemdata", checkAuthicationMiddleware, checkIsAdminMiddleware, itemController.changeItemData);
router.get("/getcount", itemController.getCount);
router.get("/getone", itemController.getOne);
router.get("/getall", itemController.getAll);

module.exports = router;