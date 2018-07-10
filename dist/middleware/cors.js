"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function cors(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-type,Accept,Authorization");
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    return next();
}
exports.cors = cors;
//# sourceMappingURL=cors.js.map