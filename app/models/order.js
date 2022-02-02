const mongoose = require('mongoose');
const Schema = mongoose.Schema;//Var first name capital it is either class or constructor

const orderSchema = new Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',//To link with collection
        required: true
    },
    items: {
        type: Object,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    paymentType: {
        type: String,
        default: 'COD'
    },
    paymentStatus: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        default: 'Order_placed'
    }
},{timestamps: true});

module.exports = mongoose.model('Order', orderSchema);