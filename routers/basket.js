const Router = require('express');
const router = new Router();
const bascketController = require("./controllers/basketController");
const checkAuthication = require("../middleware/checkAuthicationMiddleware");

router.get("/getone", checkAuthication, bascketController.getOne);

module.exports = router;