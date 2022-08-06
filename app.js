//jshint esversion:6



const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const homeStartingContent =
    "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
    "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
    "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

    var today = new Date();
    var dd = today.getDate();
    
    var mm = today.getMonth()+1; 
    var yyyy = today.getFullYear();
    if(dd<10) 
    {
        dd='0'+dd;
    } 
    
    if(mm<10) 
    {
        mm='0'+mm;
    } 
    today = dd+'-'+mm+'-'+yyyy;
    

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))

const mongoose = require('mongoose');

//creating a connection with db
mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

//creating schema
const journalSchema = new mongoose.Schema({

    title: String,
    content: String,
    feedback: String,
    date:String
   
   });

//creating model
const Journal= mongoose.model("Journal", journalSchema);
const userSchema ={
    email :String,
    password:String,
    
   

}

const User = new mongoose.model ("User",userSchema);

app.get("/", function(req, res) {  
    Journal.find({}, function(err, journals){
        res.render("home", {
          startingContent: homeStartingContent,
          posts: journals

          });
      });

});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});
app.get("/about", function(req, res) {
    res.render("about", { name: "about", para1: aboutContent });
});
app.get("/contact", function(req, res) {
    res.render("contact", { para2: contactContent });
});

app.get("/compose", function(req, res) {
   
    res.render("compose",{todayDate:today});
});



app.post("/compose", function(req, res) {
    const journ = new Journal({
        title: req.body.postTitle, 
        content: req.body.postBody,
        feedback:req.body.feedBack,
        date:today
      });
      journ.save(function(err){
        if (!err){
            res.redirect("/");
        }
      });

});
 
app.get("/posts/:postId", function(req, res){

    const requestedPostId = req.params.postId;
    
    
      Journal.findOne({_id: requestedPostId}, function(err, jour){
        res.render("post", {
          title: jour.title,
          content: jour.content
        });
      });
    
    });



app.post("/register",function(req,res){
    const newUser = new User({
        email:req.body.username,
        password:req.body.password
       
    });

    newUser.save(function(err){
        if(err){
            console.log(err);
        }
        else{
            res.render("login");
        }
    });
});

app.post("/login",function(req,res){
    console.log("hello");
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email:username},function(err,foundUser){
        console.log("success");
        if(err){
            console.log(err);
        }
        else{
            if(foundUser){
                if(foundUser.password === password){
                   res.redirect("/compose");
                }
            }
        }
    });
});





    
app.listen(3100, function(req, res) {
    console.log("App started at port 3100");
});