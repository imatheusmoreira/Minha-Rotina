const mongoose = require('mongoose')
const Schema = mongoose.Schema

const taskSchema = new mongoose.Schema({
    user_uid: { type: String, required: true }, //UID
    name: { type: String, required: true },
    tag_id: { type: String, required: true, default: 0 },
    finished: { type: Boolean, required: true, default: false },
    status: { type: Boolean, required: true, default: false },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('task', taskSchema, 'tasks')