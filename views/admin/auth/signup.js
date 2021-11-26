const layout = require("../layout");

const getError = (errors, prop) => {
  try {
    return errors.mapped()[prop].msg;
  } catch (err) {
    return "";
  }
};

module.exports = ({ errors }) => {
  return layout({
    content: `
      <div>
        <form method="POST">
          <input name="name" placeholder="name" />
          ${getError(errors, "name")}
          <input name="email" placeholder="email" />
          ${getError(errors, "email")}
          <input name="password" placeholder="password" />
          ${getError(errors, "password")}
          <input name="passwordConfirmation" placeholder="repeat password" />
          ${getError(errors, "passwordConfirmation")}
          <button>Sign Up</button>
        </form>
      </div>
  `,
  });
};
