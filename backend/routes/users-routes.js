const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const usersControlers = require("../controllers/users-controller");

router.get("/", usersControlers.getUsers);

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersControlers.signup
);
router.post("/login", usersControlers.login);
module.exports = router;
