const Router = require('express');
const router = new Router();
const controller = require("./controllers/userController");
const checkAuthication = require("../middleware/checkAuthicationMiddleware");

router.post("/registraton", controller.registraton);
router.post("/login", controller.login);
router.post("/delet", controller.delet);
router.get("/check", controller.check);
router.get("/getuserdata", checkAuthication, controller.getUserData);
router.post("/addcar", checkAuthication, controller.addUserCar);

module.exports = router;