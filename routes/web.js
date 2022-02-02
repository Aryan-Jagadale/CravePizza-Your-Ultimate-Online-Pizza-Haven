const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');
const orderController = require('../app/http/controllers/customers/orderController');
const adminOrderController = require('../app/http/controllers/admin/orderController');
const statusController = require('../app/http/controllers/admin/statusController')

const guest = require('../app/http/middleware/guest');
const auth = require('../app/http/middleware/auth');
const admin = require('../app/http/middleware/admin');


function initRoutes(app) {
    
    app.get("/",homeController().index);

    app.get("/cart",cartController().index);
    
    app.get("/login",guest, authController().login);
    app.post("/login", authController().postLogin);
    
    app.get("/register",guest, authController().register)  
    app.post("/register", authController().postRegister);

    app.post("/update-cart",cartController().update);

    app.post("/logout", authController().logout);

    app.post("/orders",auth ,orderController().store);

    //Customer routes
    app.get("/customer/orders", auth,orderController().index);
    app.get('/customer/orders/:id',auth,orderController().show)
    app.get('/feedback',(req,res)=>{
        res.render('customers/feedback');
    });
    
    //Admin routes
    app.get('/admin/orders',admin ,adminOrderController().index)
    app.post('/admin/order/status', admin, statusController().update)

}

module.exports = initRoutes;
//export default initRoutes;