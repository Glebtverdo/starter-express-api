const Router = require('express');
const router = new Router();
const itemController = require("./controllers/itemController");
const checkAuthication = require("../middleware/checkAuthicationMiddleware");
const checkIsAdminMiddleware = require('../middleware/checkIsAdminMiddleware');

router.post("/newitem", checkAuthication, checkIsAdminMiddleware, itemController.create);
router.post("/delet", checkAuthication, checkIsAdminMiddleware, itemController.delet);
router.post("/changeitemdata", checkAuthication, checkIsAdminMiddleware, itemController.changeItemData);
router.get("/getcount", itemController.getCount);
router.get("/getone", itemController.getOne);
router.get("/getall", itemController.getAll);

module.exports = router;