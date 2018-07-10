"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bson_1 = require("bson");
function validateObjectId(req, res, next) {
    const id = req.params.id;
    if (!bson_1.ObjectId.isValid(id)) {
        res.status(400).send({ error: 'Invalid id!' });
        return;
    }
    next();
}
exports.validateObjectId = validateObjectId;
//# sourceMappingURL=objectidvalidator.js.map