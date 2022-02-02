import axios from "axios";
import Noty from "noty";
import { loadStripe } from "@stripe/stripe-js";
import { placeOrder } from "./apiService"


export async function initStripe() {
  const stripe = await loadStripe(
    "pk_test_51K0SGNSEdo05GZb0m9mTl1jptxwW1rV3sPzJX6OS2MR46bJfL6QMq0gyZCeEMf4nwsNYjjIndXfPBaCxC1OGYLwR00wk5tWEZb"
  );
  let card;

  function mountWidget() {
    let style = {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    };
    const elements = stripe.elements();
    card = elements.create("card", { style, hidePostalCode: true });
    card.mount("#card-element");
  }

  const paymentType = document.querySelector("#paymentType");
  if(!paymentType) {
    return;
  }
  paymentType.addEventListener("change", (e) => {
    //console.log(e.target.value);
    if (e.target.value === "card") {
      //display widget
        mountWidget();
    } else {
        //hide widget or destroy widget
        card.destroy();

    }
  });

  const paymentForm = document.querySelector("#payment-form");
  if (paymentForm) {
    paymentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let formData = new FormData(paymentForm);
      //console.log(formData.entries());
      let formObject = {};
      for (let [key, value] of formData.entries()) {
        //console.log(key);
        //console.log(key,value);
        formObject[key] = value;
      }

      if(!card){
        placeOrder(formObject);
        //console.log(formObject);
        return;
      }
        //Verify card
        stripe.createToken(card).then((result) => {
            //console.log(result);
            //let stripeToken;
            formObject.stripeToken = result.token.id;
            placeOrder(formObject);
            //console.log(formObject);
        
        }).catch((error) => {
              console.log(error);
        })
      

      
    });
  }
}
