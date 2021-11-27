const { check } = require("express-validator");
const usersRepo = require("../../repositories/users");

module.exports = {
  requireName: check("name")
    .trim()
    .isAlpha("pt-BR")
    .withMessage("Invalid name, must contain only letters from a to z"),
  requireEmail: check("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Invalid e-mail")
    .custom(async (email) => {
      const existingEmail = await usersRepo.getOneBy({ email: email });

      if (existingEmail) {
        throw new Error("Email already in use");
      }
    }),
  requirePassword: check("password")
    .isLength({ min: 6, max: 25 })
    .withMessage("Password must be between 6 and 25 characters"),
  requirePasswordConfirmation: check("passwordConfirmation").custom(
    (passwordConfirmation, { req }) => {
      if (passwordConfirmation !== req.body.password) {
        throw new Error("Passwords must match");
      }
    }
  ),
  requireEmailExists: check("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Invalid email")
    .custom(async (email) => {
      const user = await usersRepo.getOneBy({ email });

      if (!user) {
        throw new Error("Email or password don't match");
      }
    }),
  requireValidPasswordForUser: check("password").custom(
    async (password, { req }) => {
      const user = await usersRepo.getOneBy({ email: req.body.email });

      if (!user) {
        throw new Error("Email or password don't match");
      }

      const validPassword = await usersRepo.comparePasswords(
        user.password,
        password
      );

      if (!validPassword) {
        throw new Error("Email or password don't match");
      }
    }
  ),
};
