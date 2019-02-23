import express from "express";
import validate from "express-validation";
import User from "../models/User";
import validator from "../middlewares/validator";

const router = express.Router();

router.post("/", [validate(validator.login)], (req, res) => {
  const { credentials } = req.body;
  User.findOne({ email: credentials.email }).then(user => {
    if (user && user.isValidPassword(credentials.password)) {
      res.json({ user: user.toAuthJSON() });
    } else {
      res.status(400).json({ errors: { global: "Invalid credentials" } });
    }
  });
});

router.post("/confirmation", (req, res) => {
  const token = req.body.token;
  User.findOneAndUpdate(
    { confirmationToken: token },
    { confirmationToken: "", confirmed: true },
    { new: true }
  ).then(user =>
    user ? res.json({ user: user.toAuthJSON() }) : res.status(400).json({})
  );
});

// router.post("/reset_password_request", (req, res) => {
//   User.findOne({ email: req.body.email }).then(user => {
//     if (user) {
//       sendResetPasswordEmail(user);
//       res.json({});
//     } else {
//       res
//         .status(400)
//         .json({ errors: { global: "There is no user with such email" } });
//     }
//   });
// });

export default router;
