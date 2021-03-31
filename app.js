const express = require('express')
const bodyParser = require("body-parser")
const hbs = require('hbs')

hbs.registerPartials(__dirname + '/views/partials');

const app = express()

app.use(express.static("public"))
app.set('view engine','hbs')
app.use(bodyParser.urlencoded({
    extended:true
}));
app.get('/',(req,res)=>{
    res.render("home")
})
app.get('/login',(req,res)=>{
    res.render("login")
})
app.get('/register',(req,res)=>{
    res.render("register")
})
app.get('/secrets',(req,res)=>{
    res.render("secrets")
})



app.listen(3000,()=>{
    console.log("Server started on https://localhost:3000")
})