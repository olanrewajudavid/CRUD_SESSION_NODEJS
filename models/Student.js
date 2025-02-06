// REQUIRED: uses the mongoose library
const mongoose = require("mongoose");


// SCHEMA: data structure that represents ONE document in your collection
// Specifies the properties of a Student & the data types of each property
const studentSchema = new mongoose.Schema({
   name: { type: String },
   gpa: { type: Number },
   tuitionPaid: { type: Boolean},   
}, { timestamps: true });

// MODEL: 
// 1. Creates a data structure that has functions for you to 
// use to manipulate the collection
// .find()
// .findById()
// .findByIdAndUpdate()
// .create()
// .findByIdAndDelete()
// 2. Attempt to create a collection in the database called "Students"
// - If the collection does not exist, then create it
// - Otherwise, use the existing collection
module.exports = mongoose.model("Student", studentSchema);