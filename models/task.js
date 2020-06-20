const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    user_uid: { type: String, required: true }, //UID
    name: { type: String, required: true },
    tag_id: { type: String, required: true, default: 0 },
    finished: { type: Boolean, required: true, default: false },
    status: { type: Boolean, required: true, default: false },
    days_of_week: { type: Array, required: true, "default": [] },//Put day 0 to Domingo, 1 to Monday...
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema, 'tasks')