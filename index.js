// // const http=require("http");
// import http from "http";
// // import gfName,{gfName2,gfName3 } from "./features.js";
// // console.log(gfName);
// // console.log(gfName2);
// // console.log(gfName3);
//         // import * as myObj from"./features.js";
//         // console.log(myObj);
// import {generateLovePercent} from "./features.js";


// const server=http.createServer((req,res)=>{
//     if(req.url==="/about"){
//         res.end(`<h1>Love is ${generateLovePercent()}</h1>`);
//     }
//     else if(req.url==="/"){
//         res.end("<h1>Home Page</h1>");
//     }
//     else{
//         res.end("<h1>Page Not Found</h1>");
//     }
// });
// server.listen(5000,()=>{
//     console.log("Server is working!");
// });


// // ------------------------------express-------------------------------

import express from "express";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

mongoose.connect("mongodb://127.0.0.1:27017",{
    dbName:"backend",
})
.then(()=>console.log("Database Connected"))
.catch((e)=>console.log(e));

const userSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String,
});
const User=mongoose.model("Users",userSchema);


const app=express();
// const users=[];
//using middleware
app.use(express.static(path.join(path.resolve(),"public")));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.set("view engine","ejs"); //setting up view engine

const isAuthenticated=async (req,res,next)=>{
    const {token}=req.cookies;
    if(token){
        const decoded=jwt.verify(token,"sjdjfdsjfjdcfdc");
        // console.log(decoded);
        req.user=await User.findById(decoded._id);
       next();
    }else{
        // res.render("login");
        res.redirect("/login");
    }
};
app.get("/",isAuthenticated,(req,res)=>{
    // res.send("viral rand!");
    // res.sendStatus(404);    
    // res.json({
    //     success:true,
    //     products:[],
    // res.render("index",{name:"Ajay"});
    // const token=req.cookies.token;
    // const {token}=req.cookies;
    // if(token){
    //     res.render("logout");
    // }else{
    //     res.render("login");
    // }
    res.render("logout",{name:req.user.name});
    // res.sendFile("index");
});
app.get("/login",(req,res)=>{
    res.render("login");
});
app.get("/register",(req,res)=>{
    res.render("register");
});
app.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    let user=await User.findOne({email});
    if(!user) return res.redirect("/register");
    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch) return res.render("login",{email,message:"Incorrect Password"});
    const token=jwt.sign({_id:user._id},"sjdjfdsjfjdcfdc");
    res.cookie("token",token,{
        httpOnly:true,
        expires:new Date(Date.now()+60*1000),
    });
    res.redirect("/");
});
app.post('/register',async(req,res)=>{
    const {name,email,password}=req.body;
    let user=await User.findOne({email});
    if(user){
        return res.redirect("/login");
    }
    const hashedPassword=await bcrypt.hash(password,10);
     user=await User.create({
        name,
        email,
        password:hashedPassword,
    });
    const token=jwt.sign({_id:user._id},"sjdjfdsjfjdcfdc");
    res.cookie("token",token,{
        httpOnly:true,
        expires:new Date(Date.now()+60*1000),
    });
    res.redirect("/");
});
app.get('/logout',(req,res)=>{
    res.cookie("token",null,{
        httpOnly:true,
        expires:new Date(Date.now()),
    });
    res.redirect("/");
});
app.get("/add",async(req,res)=>{
    await Message.create({name:"ajay",email:"sample2@gmail.con"});
    res.send("nice");
});
// app.get("/success",(req,res)=>{
//     res.render("success");
// });
// app.post("/contact",async(req,res)=>{
//     // console.log(req.body.name);
//     // const messageData={username:req.body.name,email:req.body.email};
//     // console.log(messageData);
//     // await Message.create({name:req.body.name,email:req.body.email});
//     const {name,email}=req.body;
//     // await Message.create({name:name,email:email});
//     await Message.create({name,email});
//     // res.render("success")
//     res.redirect("/success");
// });
// app.get("/users",(req,res)=>{
//     res.json({
//         users,
//     });
// });
app.listen(5000,()=>{
    console.log("server is working!");
})