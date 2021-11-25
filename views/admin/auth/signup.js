const layout = require("../layout");

module.exports = () => {
  return layout({
    content: `
      <div>
        <form method="POST">
          <input name="name" placeholder="name" />
          <input name="email" placeholder="email" />
          <input name="password" placeholder="password" />
          <input name="passwordConfirmation" placeholder="repeat password" />
          <button>Sign Up</button>
        </form>
      </div>
  `,
  });
};
