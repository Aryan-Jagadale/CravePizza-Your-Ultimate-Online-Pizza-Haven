//Login  && registration controller
const User = require("../../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");


function authController() {
  const _getRedirectUrl = (req) => {
    //console.log(req.user.role);
    return req.user.role === 'admin' ? '/admin/orders' : '/customer/orders'
  }

  return {
    login(req, res) {
      res.render("auth/login");
    },

    postLogin(req, res, next) {



      passport.authenticate('local', (err, user, info) => {
        //Valiate request
        const {email, password } = req.body;
        if (!email || !password) {
          req.flash("error", "All fields are required");
          return res.redirect("/login");
        }


        if (err) {
          req.flash("error", info.message);
          return next(err);
        }

        if (!user) {
          req.flash("error", "Wrong name or password");
          return res.redirect("/login");
        }

        req.logIn(user, (err) => {
          if (err) {
            req.flash("error", info.message);
            return next(err);
          }
          return res.redirect(_getRedirectUrl(req));
        });
      })(req, res, next);

      
    },

    register(req, res) {
      res.render("auth/register");
    },

    async postRegister(req, res) {
      const { name, email, password } = req.body;
      //console.log(req.body);

      // Validate request
      if (!name || !email || !password) {
        req.flash("error", "All fields are required");
        req.flash("name", name); //After reloading the page, the name will be displayed
        req.flash("email", email);
        return res.redirect("/register");
      }

      // Check for existing user
      User.exists({ email: email }, (err, result) => {
        if (result) {
          req.flash("error", "Email already taken");
          req.flash("name", name);
          req.flash("email", email);
          return res.redirect("/register");
        }
      });
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a user
      const user = new User({
        name,
        email,
        password: hashedPassword,
      });

      // Save user to database
      user
        .save()
        .then((user) => {
          return res.redirect("/");
        })
        .catch((err) => {
          //console.log(err);
          req.flash("error", "Something went wrong");
          return res.redirect("/register");
        });
    },

    logout(req, res) {
      req.logout();
      return res.redirect("/login");
    }
  };
}
module.exports = authController;
