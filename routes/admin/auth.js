const express = require("express");
const { check, validationResult } = require("express-validator");

const usersRepo = require("../../repositories/users");
const signupTemplate = require("../../views/admin/auth/signup");
const signinTemplate = require("../../views/admin/auth/signin");

const router = express.Router();

router.get("/signup", (req, res) => {
  res.send(signupTemplate());
});

router.post(
  "/signup",
  [
    check("name").trim().isAlpha("pt-BR"),
    check("email").trim().normalizeEmail().isEmail(),
    check("password").isLength({ min: 6, max: 25 }),
    check("passwordConfirmation"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    console.log(errors);

    const { name, email, password, passwordConfirmation } = req.body;

    const existingUser = await usersRepo.getOneBy({ email: email });

    if (existingUser) {
      return res.send("Email already in use");
    }

    if (password !== passwordConfirmation) {
      return res.send("Passwords must match");
    }

    // Create a user in the user repo
    const user = await usersRepo.create({ name, email, password });

    // Store the id of the user inside the users cookie
    req.session.userId = user.id;

    res.send("Account created!");
  }
);

router.get("/signout", (req, res) => {
  req.session = null;

  return res.send("Goodbye!");
});

router.get("/signin", (req, res) => {
  res.send(signinTemplate());
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const user = await usersRepo.getOneBy({ email });

  if (!user) {
    return res.send("Email not found");
  }

  const validPassword = await usersRepo.comparePasswords(
    user.password,
    password
  );
  if (!validPassword) {
    return res.send("Invalid password");
  }

  req.session.userId = user.id;

  res.send(`Welcome ${user.name}!`);
});

module.exports = router;
