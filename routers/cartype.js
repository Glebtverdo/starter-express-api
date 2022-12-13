const Router = require('express');
const router = new Router();
const carTypeController = require("./controllers/carTypeController");
const checkAuthication = require("../middleware/checkAuthicationMiddleware");
const checkIsAdminMiddleware = require('../middleware/checkIsAdminMiddleware');

router.get("/getall", carTypeController.getAllCarTypes);
router.post("/getallbyid", carTypeController.getCarsByIds);
router.post("/create", checkAuthication, checkIsAdminMiddleware, carTypeController.create);

module.exports = router;