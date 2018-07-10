"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const EventSchema = new mongoose_1.Schema({
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
    const event = this;
    event.createdAt = new Date().getTime();
    next();
});
exports.Event = mongoose_1.model('Event', EventSchema);
//# sourceMappingURL=event.model.js.map