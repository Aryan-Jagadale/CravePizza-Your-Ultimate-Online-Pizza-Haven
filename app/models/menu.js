const mongoose = require('mongoose');
const Schema = mongoose.Schema;//Var first name capital it is either class or constructor

const menuSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: Number,
        required: true
    },
    price : {
        type: String,
        required: true
    },
    size : {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Menu', menuSchema);