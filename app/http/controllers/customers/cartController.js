
function cartController() {
  return {
    index(req, res) {
      res.render("customers/cart");
    },

    update(req, res) {
      
      /*// for the first time creating cart and adding basic object structure
      let { _id,price}=req.body;
      if (!req.session.cart) {
        req.session.cart = {
          items: {},
          totalQty: 0,
          totalPrice: 0
        }
      }
      let cart = req.session;
      
      // Check if item does not exist in cart
      if (!cart.items[_id]) {
        cart.items[_id] = {
          item: req.body,
          qty: 1,
        };
        cart.totalQty += 1;
        cart.totalPrice += price;

      } else {
        cart.items[_id].qty += 1;
        cart.totalQty += 1;
        cart.totalPrice += price;
      }
      return res.json({ totalQty: cart.totalQty});
      return res.json({ data: "All is well" });*/
      const { _id, price } = req.body.pizza;
			// First time creating cart and adding basic object structure
			if(!req.session.cart) {
				req.session.cart = {
					items: {},
					totalQty: 0,
					totalPrice: 0
				}
			}
			let { cart } = req.session;
      //console.log(req.body.pizza);
      //return res.json({ data: "All is well" });

			if(!cart.items[_id]) {
				cart.items[_id] = {
					item: req.body.pizza,
					qty: 1,
				}
				cart.totalQty += 1;
				cart.totalPrice += parseInt(price);
			}
			else {
				cart.items[_id].qty += 1;
				cart.totalQty +=1;
				cart.totalPrice += parseInt(price);
			}
			
			return res.json({
				totalQty: cart.totalQty,
			});
    },
  };
}
module.exports = cartController;
