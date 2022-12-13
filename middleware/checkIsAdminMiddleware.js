module.exports = function (req, res, next) {
	try {
		const user = req.user;
		if (user.role !== "Admin") {
            return res.status(403).json({message: "Нет доступа"});
        }
		next();
	} catch (error) {
		return res.status(401).json({message: "ошибка авторизации"});
	}
}