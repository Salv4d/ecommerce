const express = require("express");
const { route } = require("./admin/products");

const router = express.Router();

router.get("/", async (req, res) => {
  res.send("products");
});

module.exports = router;