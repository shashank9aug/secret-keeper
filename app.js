
require('dotenv').config()

const express = require('express')
const bodyParser = require("body-parser")
const hbs = require('hbs')
const mongoose = require("mongoose")
const session = require('express-session')
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');

hbs.registerPartials(__dirname + '/views/partials');

const app = express()
app.use(express.static('views/images')); 

app.use(express.static("public"))

app.set('view engine','hbs')

app.use(bodyParser.urlencoded({
    extended:true
}));

//express-session
app.use(session({
    secret: "This is our little secret.",
    resave:false,
    saveUninitialized: false
}));

//passport
app.use(passport.initialize())
app.use(passport.session())

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true})
mongoose.set("useCreateIndex",true)

const userSchema = new mongoose.Schema({
    email:String,
    password:String,
    googleId:String
})

//plugin will hash and salt the password then store it in db
userSchema.plugin(passportLocalMongoose)
userSchema.plugin(findOrCreate)

const User = new mongoose.model("User",userSchema)

passport.use(User.createStrategy())

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
});

/*
 there is so much difference between https and http
   make sure in mind

 */  


passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/secrets',
    userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
  },
  function(accessToken, refreshToken, profile, cb) {
      console.log(profile)
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get('/',(req,res)=>{
    res.render("home")
})


app.get("/auth/google",
    passport.authenticate('google', { scope: ["profile"] })
)

app.get("/auth/google/secrets",
 passport.authenticate('google', { failureRedirect: '/login'}),
 function(req,res) {
     //successfull authentication
     res.redirect("/secrets");
});


app.get('/login',(req,res)=>{
    res.render("login")
})

app.get('/register',(req,res)=>{
    res.render("register")
})

app.get("/secrets",(req,res)=>{
    if(req.isAuthenticated()){
        res.render("secrets")
    } else {
        res.redirect("/login");
    }
});

app.get("/logout",(req,res)=>{
    req.logout()
    res.redirect("/")
})

app.post('/register',(req,res)=>{
//     const newUser = new User({
//         name:req.body.username,
//         email:req.body.email,
//         password:req.body.password
//     })

//     newUser.save((err)=>{
//         if(err){
//             console.log(err)
//         }
//         else{
//             res.render("secrets")
//         }   
//     })
     
    User.register({username: req.body.username}, req.body.password, function(err, user){
       if(err) {
           console.log(err);
           res.redirect("/register")
       }    
       else{
           passport.authenticate("local")(req, res, function(){
               res.redirect("/secrets");
           })
       }    
    })
})

app.post("/login",(req,res)=>{
//     const username = req.body.username;
//     const password = req.body.password;

//     User.findOne({email: username}, (err, foundUser)=>{
//         if(err){
//             console.log(err);
//         }
//         else{
//             if(foundUser){
//                 if(foundUser.password === password){
//                     res.render("secrets");
//                 }
//             }
//         }
//     })
    
    const user = new User({
        username : req.body.username,
        password : req.body.password
    });
    
    req.login(user,(err)=>{
        if(err) {
            console.log(err);
        }
        else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets");
            })
        }
    })
})

app.listen(3000,()=>{
    console.log("Server started on http://localhost:3000")
})