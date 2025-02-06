const mongoose = require("mongoose");


const userAccountSchema = new mongoose.Schema({
  email: { type: String },
  password: { type: String },
  userType: { type: String},     
}, { timestamps: true });


module.exports = mongoose.model("UserAccount", userAccountSchema);