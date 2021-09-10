const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  username: { type: String, required: true, min: 6 },
  name: { type: String, required: true },
  password: { type: String, required: true, min: 3 },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("users", UserSchema);
