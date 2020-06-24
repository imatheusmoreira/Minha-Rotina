const mongoose = require('mongoose')

//Interface that represents categories created by user
const categorySchema = new mongoose.Schema({
    user_uid: { type: String, required: true }, //UID
    description: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Category', categorySchema, 'categories')
