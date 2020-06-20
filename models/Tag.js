const mongoose = require('mongoose')

//Interface that represents tags created by user
const tagSchema = new mongoose.Schema({
    user_uid: { type: String, required: true }, //UID
    description: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tag', tagSchema, 'tags')
