const Router = require('express');
const router = new Router();
const controller = require("./controllers/userController");
const checkAuthicationMiddleware = require('../middleware/CheckAuthicationMiddleware');

router.post("/registraton", controller.registraton);
router.post("/login", controller.login);
router.post("/delet", controller.delet);
router.get("/check", controller.check);
router.get("/getuserdata", checkAuthicationMiddleware, controller.getUserData);
router.post("/addcar", checkAuthicationMiddleware, controller.addUserCar);

module.exports = router;