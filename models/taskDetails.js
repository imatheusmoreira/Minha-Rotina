const mongoose = require('mongoose')
const Schema = mongoose.Schema

const taskDetailsSchema = new mongoose.Schema({
    task_id: { type: String, required: true }, //Task ID
    expected_difficulty: { type: Number, default: 0 },
    description: { type: String, default: '' },
    completed_minutes: { type: Number, required: false, default: 0 },
    completed_days: { type: Number, required: false, default: 0 },
    real_difficulty: { type: Number, default: 0 },
    final_annotation: { type: String, default: '' },
    show_before_options: { type: Boolean, default: false },
    show_after_options: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TaskDetail', taskDetailsSchema, 'taskDetails')