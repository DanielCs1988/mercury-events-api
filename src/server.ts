import * as express from 'express';
import {json} from "body-parser";
import {connect} from "mongoose";
import {validateJwt} from "./middleware/authenticator";
import {Event} from "./models/event.model";
import {pick} from 'lodash';
import {validateObjectId} from "./middleware/objectidvalidator";
import {cors} from "./middleware/cors";

const app = express();
connect(process.env.MONGODB_URI!, {useNewUrlParser: true});

app.use(cors);
app.use(validateJwt);
app.use(json());

app.get('/events', async (req, res) => {
    try {
        const events = await await Event.find({});
        res.send(events);
    } catch (e) {
        res.status(400).send();
    }
});

app.get('/events/:id', validateObjectId, async (req, res) => {
    const id = req.params.id;
    try {
        const event = await Event.findById(id);
        if (!event) {
            res.status(404).send({error: 'No such event!'});
            return;
        }
        res.send(event);
    } catch (e) {
        res.status(400).send(e);
    }
});

app.post('/events', async (req, res) => {
    const newEvent = new Event(pick(req.body,
        ['name', 'description', 'pictureUrl', 'startDate', 'endDate', 'location']
    ));
    newEvent.organizer = req.user.sub;
    try {
        const savedEvent = await newEvent.save();
        res.send(savedEvent);
    } catch (e) {
        res.status(400).send(e);
    }

});

app.put('/events/:id', validateObjectId, async (req, res) => {
    const id = req.params.id;
    const body: any = pick(req.body, ['name', 'description', 'pictureUrl', 'startDate', 'endDate', 'location']);

    try {
        const event = await Event.findOneAndUpdate(
        {_id: id, organizer: req.user.sub},
        {$set: body},
            {new: true}
        );
        if (event) {
            res.send(event);
            return;
        }
        res.status(404).send({error: 'Could not find an event with that id!'});
    } catch (e) {
        res.status(400).send({error: 'Could not reach database!'});
    }
});

app.post('/events/:id', validateObjectId, async (req, res) => {
    const id = req.params.id;
    const user = req.user.sub;
    try {
        let event = await Event.findById(id);
        if (!event) {
            res.status(404).send({error: 'Could not find an event with that id!'});
            return;
        }
        if (event.participants.find(participant => participant === user)) {
            event = await Event.findByIdAndUpdate(
                id, { $pull: { participants: user } }, {new: true}
            );
        } else {
            event = await Event.findByIdAndUpdate(
                id, { $addToSet: { participants: user } }, {new: true}
            );
        }
        res.send(event);
    } catch (e) {
        res.status(400).send({error: 'Could not reach database!'});
    }
});

app.delete('/events/:id', validateObjectId, async (req, res) => {
    const id = req.params.id;
    try {
        const event = await Event.findOneAndRemove({_id: id, organizer: req.user.sub});
        if (event) {
            res.send(event);
            return;
        }
        res.status(404).send({error: 'Could not find an event with that id!'});
    } catch (e) {
        res.status(400).send({error: 'Could not reach database!'});
    }
});

app.listen(process.env.PORT, () => console.log(`Server listening on port ${process.env.PORT}...`));