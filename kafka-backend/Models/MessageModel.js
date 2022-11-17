const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var messageSchema = new Schema({
    user_id1:{type: mongoose.ObjectId, required: true},
    user_id2:{type: mongoose.ObjectId, required: true},
    messageList:{type: Array}
},
{
    collection:'message'
},
{
    versionKey: false
});

const messageModel = mongoose.model('message', messageSchema);
module.exports = messageModel;