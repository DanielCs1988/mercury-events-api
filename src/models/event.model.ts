import {Document, Schema, model} from "mongoose";

export interface EventModel extends Document {
    name: string;
    description: string;
    pictureUrl?: string;
    createdAt: number,
    startDate: number;
    endDate: number;
    organizer: string;
    participants: string[];
}

const EventSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    description: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    pictureUrl: {
        type: String,
        required: false
    },
    createdAt: {
        type: Number
    },
    startDate: {
        type: Number,
        required: true
    },
    endDate: {
        type: Number,
        required: true
    },
    organizer: {
        type: String,
        required: true
    },
    participants: [{
        type: String,
        required: true
    }]
});

EventSchema.pre('save', function (next) {
    const event = <EventModel>this;
    event.createdAt = new Date().getTime();
    next();
});

export const Event = model<EventModel>('Event', EventSchema);