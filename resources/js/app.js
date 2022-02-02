//Client code
import axios from "axios";
import Noty from 'noty';
import initAdmin  from './admin'
import moment from 'moment'
import { initStripe } from "./stripe";
import User from '../../app/models/user'
import user from "../../app/models/user";

let addToCart = document.querySelectorAll('.add-to-cart');
let cartCounter = document.querySelector('#cartCounter');

function updateCart(pizza) {
    axios.post('/update-cart', {pizza})
    .then(res=>{
        //console.log(res);
        cartCounter.innerText = res.data.totalQty;
        new Noty({
            type: 'success',
            timeout: 1000,
            progressBar: false,
            layout: 'bottomLeft',
            text: 'Item added to cart'
        }).show();
    })
    .catch(err=>{
        new Noty({
            type: 'error',
            timeout: 1000,
            progressBar: false,
            layout: 'bottomLeft',
            text: 'Something went wrong'
        }).show();
    });
}


//console.log("Connecting to public js");
addToCart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let pizza = JSON.parse(btn.dataset.pizza)
        //console.log(pizza);
        updateCart(pizza)
    })
})
// Remove alert message after X seconds
const alertMsg = document.querySelector('#success-alert')
if(alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    }, 2000)
}

let adminAreaPath = window.location.pathname
if(adminAreaPath.includes('admin')) {
    initAdmin()
}
//initAdmin();

// Change order status
// Change order status
let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
let time = document.createElement('small')

function updateStatus(order) {
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepCompleted = true;
    statuses.forEach((status) => {
       let dataProp = status.dataset.status
       if(stepCompleted) {
            status.classList.add('step-completed')
       }
       if(dataProp === order.status) {
            stepCompleted = false
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
           if(status.nextElementSibling) {
            status.nextElementSibling.classList.add('current')
           }
       }
    })
}
updateStatus(order);

initStripe();

//Email send
const submitBtn = document.getElementById('submitFeedback');
submitBtn.addEventListener('click', () => {
    Email.send({
        Host:"smtp.mailtrap.io",
        Username:"########",//Who has an smtp server.....
        Password : "#########",//Password of the smtp server
        To : '##########',//Email address of the receiver
        From : document.getElementById('username').value,
        Subject : "Client mail",
        Body : "Sender's mail: "+ document.getElementById('username').value + "<br>" +"Decription: "+document.getElementById('feedback').value      
    }).then(res =>{
        document.getElementById('feedback').value = "";
        new Noty({
            type: 'success',
            timeout: 1000,
            progressBar: false,
            layout: 'bottomLeft',
            text: 'Email sent'
        }).show();
    }).catch(err =>{
        new Noty({
            type: 'error',
            timeout: 1000,
            progressBar: false,
            layout: 'bottomLeft',
            text: 'Something went wrong'
        }).show();
    })
})


