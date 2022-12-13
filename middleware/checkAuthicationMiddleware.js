const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    try {
        const token = req.headers.authorization
        if (!token) {
            return res.status(401).json({message: "Не авторизован"})
        }
        const decoded = jwt.verify(token, process.env.JWT_Secret_Word)
        req.user = decoded;
        next()
    } catch (e) {
        res.status(401).json({message: "Не авторизован"})
    }
}
