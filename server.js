const express = require("express")
const app = express()
const port = process.env.PORT || 8080

// tells express to use EJS
app.set("view engine", "ejs")

// tells express that this application will contain
// endpoints that receives data from a form
app.use(express.urlencoded({ extended: true }))

// database
const mongoose = require("mongoose");
require("dotenv").config();


//----------------------
// Middleware Function for Logged in
//-----------------

const checkIfUserIsLoggedIn = (req, res, next) => {
    if (req.session.loggedIn === true) {
        // continue with the endpoint logic (display the webpage)
        next()
    } else {
        return res.send(`ERROR: You must be logged in to see this page. <a href="/login">Click here to login</a>`)
        // option 2: return res.redirect()
    }
 }
  

//  const checkIfUserIsAdmin = (req, res, next) => {
//     if (req.session.accountInfo.userType === "admin") {       
//         next()
//     } else {
//         return res.send(`ERROR: Only admins are allowed. You are a ${req.session.accountInfo.userType}`)
//     }
//  }
 


// Updated to fix userType null error
 const checkIfUserIsAdmin = (req, res, next) => {
    if (req.session.loggedIn === true) {
        if (req.session.accountInfo.userType === "admin") {       
            next()
        } else {
            return res.send(`ERROR: Only admins are allowed. You are a ${req.session.accountInfo.userType}`)
        }
    } else {
        return res.send(`ERROR: You must be logged in to see this page. <a href="/login">Click here to login</a>`)
        // option 2: return res.redirect()
    } 
}

// setup sessions
const session = require('express-session')
app.use(session({
   secret: "the quick brown fox jumped over the lazy dog 1234567890",  // random string, used for configuring the session
   resave: false,
   saveUninitialized: true
}))

const Student = require("./models/Student.js")
const UserAccount = require("./models/UserAccount.js")
 
app.get("/", async (req,res) => {    
    console.log("DEBUG: What's in req.session?")
    console.log(req.session)
    console.log(`Session id: ${req.sessionID}`)
    return res.render("home.ejs")
})


// create a form that asks the user some question of your choice
app.get("/question", (req, res)=>{
    return res.render("questionForm.ejs", {id: req.sessionID})
 })

 app.get("/test", checkIfUserIsLoggedIn, (req, res)=>{
    return res.send("Test page")
 })

 // create a form that asks the user some question of your choice
 app.post("/question", (req, res)=>{
 
 
    // TODO: get the form data and save it to the session variable
    req.body.tbCity
    // add a custom property to the object called favCity
    // store the city in this property
    req.session.favCity = req.body.tbCity
    return res.send(`<p>Done, go back to home page? <a href="/">Click here</a>`)
 })
 


// Add records from the url

//http://localhost:8080/insert/Sara1234/3.0/false
app.get("/insert/:nameToAdd/:gpaToAdd/:tuitionPaidToAdd",  async (req,res)=>{

    // req.params.tuitionPaidToAdd is a string datatype
    // But your database expects a boolean for this property
    // You must convert the string to some type of boolean
    let tp = false
    if (req.params.tuitionPaidToAdd === "true") {
        tp = true
    }
 
    const result = await Student.create({
        name:req.params.nameToAdd,
        gpa:parseFloat(req.params.gpaToAdd),
        tuitionPaid: tp
    })
    console.log(result)
    return res.send(`Student inserted, look for document id: ${result._id}`)
 })



// http://localhost:8080/getAll
// app.get("/getAll", async (req, res)=>{    
//     const studentList = await Student.find()
//     console.log("DEBUG:")
//     console.log(studentList)
//     return res.render("all.ejs", {s:studentList})
// })



//Modified Home Page
// http://localhost:8080/getAll
// app.get("/getAll", async (req, res)=>{   

//     // 1. check if there user is logged in
//     if (req.session.loggedIn === true) {
//         // show the list of students
//         const studentList = await Student.find()
//         return res.render("all.ejs", {s:studentList})
//     } else {       
//         return res.send(`ERROR: You must be logged in to see this page. <a href="/login">Click here to login</a>`)
//         // option 2: return res.redirect("/login")
//     }
// })
 
// Re-write the code above
// http://localhost:8080/getAll
app.get("/getAll", checkIfUserIsLoggedIn, async (req, res)=>{   
    const studentList = await Student.find()
    return res.render("all.ejs", {s:studentList})
 })
 



// http://localhost:8080/update-specific-student/67a15bcb46f901e65816ab2a
app.get("/update-specific-student/:docId", async (req,res)=>{
    // update the specific student
    await Student.findByIdAndUpdate(req.params.docId, {name:"Paula Patel 22222", gpa:99999})
    return res.send(`Student ${req.params.docId}, refresh the database to see results`)
})

// http://localhost:8080/delete2/67a15bcb46f901e65816ab2a
// app.get("/delete2/:docId", async (req,res) => {
//     // delete an existing student
//     await Student.findByIdAndDelete(req.params.docId)
//     return res.send("Student deleted 2")
// })


// Update
// app.get("/delete2/:docId", async (req,res) => {
//     if (req.session.accountInfo.userType === "admin") {
//         await Student.findByIdAndDelete(req.params.docId)
//         return res.send("Student deleted 2")
//     }  else {
//         return res.send(`ERROR: Only admins allowed. You are a ${req.session.accountInfo.userType} usertype`)
//     }   
//  })
 




// http://localhost:8080/insert
// show the form user interface (GET)
app.get("/insert", 
    checkIfUserIsAdmin, 
    (req,res)=>{
    return res.render("addform.ejs")
})


//Only approved users cal insert
// app.get("/insert", (req,res)=>{
//     console.log(req.session.accountInfo.userType)
//     if (req.session.accountInfo.userType === "admin") {
//         return res.render("addform.ejs")   
//     } else {
//         return res.send(`ERROR: Only admins allowed. You are a ${req.session.accountInfo.userType} usertype`)
//     }   
//  })

 


// app.get("/delete2/:docId", async (req,res) => {
//     if (req.session.accountInfo.userType === "admin") {
//         await Student.findByIdAndDelete(req.params.docId)
//         return res.send("Student deleted 2")
//     }  else {
//         return res.send(`ERROR: Only admins allowed. You are a ${req.session.accountInfo.userType} usertype`)
//     }   
//  })
 

//Updated to add Middlewar

// http://localhost:8080/delete2/67a15bcb46f901e65816ab2a
app.get("/delete2/:docId", checkIfUserIsAdmin, async (req,res) => {
    await Student.findByIdAndDelete(req.params.docId)
    return res.send("Student deleted 2")
 })
 

 
 
//  // http://localhost:8080/insert
//  app.get("/insert", (req,res)=>{
//     return res.render("addform.ejs")   
//  })
 


// This endpoint is only accessible by using the form shown on http://localhost:8080/insert
// receive the data from the form (POST)
app.post("/receivedata", async (req, res)=>{    
    console.log("DEBUG: Data from form fields")
    console.log(req.body)
    let tp = undefined
    if (req.body.cbTuition === undefined) {
        tp = false
    } else {
        tp = true
    }
    const result = await Student.create({
        name:req.body.tbName,
        gpa:parseFloat(req.body.tbGPA),
        // TODO: Update to use req.body.tutioncheckbox
        tuitionPaid: tp
    })
    console.log(result)
    return res.redirect("/getAll")
    
}) 

//Update FOrm

// http://localhost:8080/update
app.get("/update", (req, res)=>{
    return res.render("updateForm.ejs")
 })
 
 
 // You cannot access this endpoint by typing into the browser address bar
 // Pressing the <button> on the <form> in the updateForm.ejs
 // 1. Go to http://localhost:8080/update
 // 2. Click on the button
 app.post("/update", async (req, res)=>{
   
    // 1.  Get the data from the form fields
    console.log(req.body)
 
 
    // validation to check if the req.body contains a property called cbTuition
    // if yes, then we set the tuitionPaid property = true
    // if no, then we set the tuitionPaid property = false
    let tp = undefined
    if (req.body.cbTuition === undefined) {
        // cbTuition is not inside req.body
        // this means that user did NOT check the checkbox
        // therefore tuition NOT paid
        tp = false
    } else {
        // cbTuition IS in the req.body object
        // this means the checkbox was checked
        // therefore tuition IS paid
        tp = true
    }
 
 
    // OPTION 2
    // let tp = undefined
    // if (req.body.cbTuition === "on") {       
    //     tp = true
    // } else {
    //     tp = false
    // }
 
 
    // console.log("What is tp? ")
    // console.log(tp)
 
 
 
 
    // 2.  Update the specified student in the database
    await Student.findByIdAndUpdate(
        req.body.tbDocId,
        {   name: req.body.tbName,
            // solves the issue where form sends data as a string, but we need a number here
            gpa:  parseFloat(req.body.tbGPA),
            // solves the issue where cbTuitionPaid is a string, not a boolean
            tuitionPaid: tp,
        }
    )
 
 
    // 3. Send a message back to the client
    // option 1: return res.send("Update success!")
    // option 2: return res.redirect("/getAll")
    return res.send("Update success!")
 })
 
 
//Option 2 Update (Professional)
app.get("/update2/:docId", async (req,res)=>{
    // send the entire student object to the template so that we can auto-populate the <form> fields with the student data
    // 1. get the entire student object
    // .findById() return the document with the specified id from the collecton
    const studentFromDB = await Student.findById(req.params.docId)
    // console.log("+++++++")
    // console.log(studentFromDB)
    // 2. send the entire student object to the template
    return res.render("updateForm2.ejs", {s:studentFromDB})
 })

 app.post("/update2/:docId", async (req,res)=>{
    let tp = undefined
    if (req.body.cbTuition === undefined) {      
        tp = false
    } else {
        tp = true
    }
 
 
    await Student.findByIdAndUpdate(
        req.params.docId,       // for this endpoint, the _id comes from the url parameters
        {   name: req.body.tbName,            
            gpa:  parseFloat(req.body.tbGPA),           
            tuitionPaid: tp,
        }
    )
    // option 1: return res.send("Update 2222222 success!")
    // option 2:
    //return res.send("Update success!")
    return res.redirect("/getAll")
 })
 




 // SESSION
 
// http://localhost:8080/createAccount
app.get("/createAccount", (req, res)=>{
    return res.render("createAccountForm.ejs")
 })
 
 
 app.post("/createAccount", async (req, res)=>{
    // 0. debug
    console.log("DEBUG: Data from user creation form is:")
    console.log(req.body)
    // 1. Does a user with the specified email already exist?
    // Search the database for the FRIST document with the specified email address
    const result = await UserAccount.findOne({email:req.body.tbEmail})
    console.log(`Here is the result: ${result}`)
 
    // null = does not exist
    if (result === null) {
        // because no user account exists, then create a new one
        await UserAccount.create({
            email:req.body.tbEmail,
            password:req.body.tbPassword,
            userType:req.body.selUserType
        })
   
        return res.send("Account created!")       
    }  else {
        return res.send("SORRRY USER ACCOUNT ALREADY EXISTS")
    }
  
 })
 
 app.get("/login", (req,res)=>{
    return res.render("loginForm.ejs")
 })

//  app.post("/login", async (req, res)=>{
//     // 1. check if this user exists
//     const accountFromDb = await UserAccount.findOne({email:req.body.tbEmail})
 
 
//     if (accountFromDb === null) {
//         // cannot find this user in the database
//         return res.send("Sorry, this user does not exist")
//     } else {
//         // if result is not null then it must contain the document with the user account info
//         // accountFromDb = {_id:___, timestamp:___, email:____, password:_____}
 
 
//         // check that the password in the database matches the password the user typed in the form
//         if (accountFromDb.password === req.body.tbPassword) {
//             return res.send("SUCCESS: You are a valid user, so logging you in")
//         } else {
//             return res.send("ERROR: Wrong password!")
//         }
//     }
//  })



// app.post("/login", async (req, res)=>{
//     const accountFromDb = await UserAccount.findOne({email:req.body.tbEmail})
 
 
//     if (accountFromDb === null) {
//         return res.send(`Sorry, this user does not exist. <a href="/">Click here</a>`)
//     } else {
//         if (accountFromDb.password === req.body.tbPassword) {
 
 
//             // add a boolean variable to the req.session to show that someone is logged in
//             req.session.loggedIn = true
//             return res.send(`<p>Done, go back to home page? <a href="/">Click here</a>`)
//         } else {
//             return res.send(`ERROR: Wrong password! <a href="/">Click here</a>`)
//         }
//     }
//  })
 

// Updated to retrive info
app.post("/login", async (req, res)=>{
    const accountFromDb = await UserAccount.findOne({email:req.body.tbEmail})
 
 
    if (accountFromDb === null) {
        return res.send(`Sorry, this user does not exist. <a href="/">Click here</a>`)
    } else {
        if (accountFromDb.password === req.body.tbPassword) {
 
 
            // add a boolean variable to the req.session to show that someone is logged in
            req.session.loggedIn = true
 
 
            // save relevant information about the user to the sessionvariable
            // lazy way: save all of the account information into the session variable
            // it will also save the password to the session variable, and this is bad from a security perspective
            req.session.accountInfo = accountFromDb
 
 
            return res.send(`<p>Done, go back to home page? <a href="/">Click here</a>`)
        } else {
            return res.send(`ERROR: Wrong password! <a href="/">Click here</a>`)
        }
    }
 })

// Log out
app.get("/logout", (req, res)=>{
    // delete the session object from the server using the built in destroy() function
    // https://stackoverflow.com/questions/5573256/how-to-end-a-session-in-expressjs
    req.session.destroy()
    return res.send(`You are logged out, return to home page? <a href="/">Go home</a>`)
    // option 2: return res.redirection("/")
 })
 


//UPdated Insert / delete

// // http://localhost:8080/delete2/67a15bcb46f901e65816ab2a
// app.get("/delete2/:docId", checkIfUserIsAdmin, async (req,res) => {
//     await Student.findByIdAndDelete(req.params.docId)
//     return res.send("Student deleted 2")
//  })
 
 
//  // http://localhost:8080/insert
//  app.get("/insert", checkIfUserIsAdmin, (req,res)=>{
//     return res.render("addform.ejs")   
//  })
 


const startServer = async () => {   
   console.log(`The server is running on http://localhost:${port}`)
   console.log(`Press CTRL + C to exit`)


   // MongoDB Connection
   try {
       await mongoose.connect(process.env.MONGODB_URI)
       console.log("Success! Connected to MongoDB")
   } catch (err) {
       console.error("Error connecting to MongoDB:", err);
   }   
}
app.listen(port, startServer)
