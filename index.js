const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const usersRepo = require("./repositories/users");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    keys: ["^C#lcq8TiBBwILcVMmVMcJzzVwlC$@2d"],
  })
);

app.get("/signup", (req, res) => {
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

app.post("/signup", async (req, res) => {
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

app.get("/signout", (req, res) => {
  req.session = null;

  return res.send("Goodbye!");
});

app.get("/signin", (req, res) => {
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

app.post("/signin", async (req, res) => {
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

app.listen(3000, () => {
  console.log("Listening");
});
