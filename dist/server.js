"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const body_parser_1 = require("body-parser");
const mongoose_1 = require("mongoose");
const authenticator_1 = require("./middleware/authenticator");
const event_model_1 = require("./models/event.model");
const lodash_1 = require("lodash");
const objectidvalidator_1 = require("./middleware/objectidvalidator");
const cors_1 = require("./middleware/cors");
const app = express();
mongoose_1.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
app.use(cors_1.cors);
app.use(authenticator_1.validateJwt);
app.use(body_parser_1.json());
app.get('/events', (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const events = yield yield event_model_1.Event.find({});
        res.send(events);
    }
    catch (e) {
        res.status(400).send();
    }
}));
app.get('/events/:id', objectidvalidator_1.validateObjectId, (req, res) => __awaiter(this, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const event = yield event_model_1.Event.findById(id);
        if (!event) {
            res.status(404).send({ error: 'No such event!' });
            return;
        }
        res.send(event);
    }
    catch (e) {
        res.status(400).send(e);
    }
}));
app.post('/events', (req, res) => __awaiter(this, void 0, void 0, function* () {
    const newEvent = new event_model_1.Event(lodash_1.pick(req.body, ['name', 'description', 'pictureUrl', 'startDate', 'endDate', 'location']));
    newEvent.organizer = req.user.sub;
    try {
        const savedEvent = yield newEvent.save();
        res.send(savedEvent);
    }
    catch (e) {
        res.status(400).send(e);
    }
}));
app.put('/events/:id', objectidvalidator_1.validateObjectId, (req, res) => __awaiter(this, void 0, void 0, function* () {
    const id = req.params.id;
    const body = lodash_1.pick(req.body, ['name', 'description', 'pictureUrl', 'startDate', 'endDate', 'location']);
    try {
        const event = yield event_model_1.Event.findOneAndUpdate({ _id: id, organizer: req.user.sub }, { $set: body }, { new: true });
        if (event) {
            res.send(event);
            return;
        }
        res.status(404).send({ error: 'Could not find an event with that id!' });
    }
    catch (e) {
        res.status(400).send({ error: 'Could not reach database!' });
    }
}));
app.post('/events/:id', objectidvalidator_1.validateObjectId, (req, res) => __awaiter(this, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const event = yield event_model_1.Event.findByIdAndUpdate(id, { $addToSet: { participants: req.user.sub } });
        if (event) {
            res.send(event);
            return;
        }
        res.status(404).send({ error: 'Could not find an event with that id!' });
    }
    catch (e) {
        res.status(400).send({ error: 'Could not reach database!' });
    }
}));
app.delete('/events/:id', objectidvalidator_1.validateObjectId, (req, res) => __awaiter(this, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const event = yield event_model_1.Event.findOneAndRemove({ _id: id, organizer: req.user.sub });
        if (event) {
            res.send(event);
            return;
        }
        res.status(404).send({ error: 'Could not find an event with that id!' });
    }
    catch (e) {
        res.status(400).send({ error: 'Could not reach database!' });
    }
}));
app.listen(process.env.PORT, () => console.log(`Server listening on port ${process.env.PORT}...`));
//# sourceMappingURL=server.js.map