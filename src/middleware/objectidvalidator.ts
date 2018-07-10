import {ObjectId} from "bson";
import * as express from 'express';

export function validateObjectId(req: express.Request, res: express.Response, next: express.NextFunction) {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
        res.status(400).send({error: 'Invalid id!'});
        return;
    }
    next();
}