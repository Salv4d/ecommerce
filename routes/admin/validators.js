const { check } = require("express-validator");
const usersRepo = require("../../repositories/users");

module.exports = {
  requireName: check("name").trim().isAlpha("pt-BR"),
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
    .withMessage("Password must be between 6 and 26 characters"),
  requirePasswordConfirmation: check("passwordConfirmation").custom(
    (passwordConfirmation, { req }) => {
      if (passwordConfirmation !== req.body.password) {
        throw new Error("Passwords must match");
      }
    }
  ),
};
