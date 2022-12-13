const Router = require('express');
const router = new Router();
const carTypeController = require("./controllers/carTypeController");
const checkAuthicationMiddleware = require('../middleware/CheckAuthicationMiddleware');
const checkIsAdminMiddleware = require('../middleware/checkIsAdminMiddleware');

router.get("/getall", carTypeController.getAllCarTypes);
router.post("/getallbyid", carTypeController.getCarsByIds);
router.post("/create", checkAuthicationMiddleware, checkIsAdminMiddleware, carTypeController.create);

module.exports = router;