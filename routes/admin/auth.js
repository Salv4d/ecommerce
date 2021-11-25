const express = require("express");
const usersRepo = require("../../repositories/users");

const router = express.Router();

router.get("/signup", (req, res) => {
  res.send(`
    <div>
      <form method="POST">
        <input name="name" placeholder="name" />
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password" />
        <input name="passwordConfirmation" placeholder="repeat password" />
        <button>Sign Up</button>
      </form>
    </div>
  `);
});

router.post("/signup", async (req, res) => {
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
});

router.get("/signout", (req, res) => {
  req.session = null;

  return res.send("Goodbye!");
});

router.get("/signin", (req, res) => {
  res.send(`
    <div>
      <form method="POST">
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password" />
        <button>Sign In</button>
      </form>
    </div>
  `);
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
