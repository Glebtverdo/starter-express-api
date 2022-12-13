const Router = require('express');
const router = new Router();
const carController = require("./controllers/carController");
const checkAuthicationMiddleware = require('../middleware/checkAuthicationMiddleware');
const checkIsAdminMiddleware = require('../middleware/checkIsAdminMiddleware');

router.get("/getallitems", carController.getAllItems);
router.get("/getallcars", carController.getAllCars);
router.post("/create", checkAuthicationMiddleware, checkIsAdminMiddleware, carController.create);

module.exports = router;