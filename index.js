import http from "http";
import express from "express";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
mongoose.connect("mongodb://localhost:27017",{
    dbName:"backend",
}).then(()=>console.log("Database Connected")).catch((e)=>console.log(e));
const app=express();
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(path.resolve(),"public")));//we make public static so that index can be accessed directly
app.use(cookieParser());
app.set("view engine","ejs");  

const msgSchema=new mongoose.Schema({
    name:String,
    email:String,
});
const msg=mongoose.model("Message",msgSchema);
const isauth=(req,res,next)=>
{
    const {token}=req.cookies;
    if(token)
    {
        // res.render("logout");
        next();
    }
    else{
        res.render("login");
    }
}
app.get("/",isauth,(req,res)=>{
    console.log(req.cookies);
    res.render("logout");
   

});
app.get("/add",async(req,res)=>{
   await msg.create({
        name:"aditya",
        email:"xydndgz@gmail.com",
    });
    res.send("Done");
});
app.post("/login",(req,res)=>
{
    res.cookie("token","iamin",{
        httpOnly: true,
        expires: new Date(Date.now()+6000),
    });
    res.redirect("/");
});
app.get("/logout",(req,res)=>{
    res.cookie("token","null",{
        expires: new Date(Date.now()),
    });
    res.redirect("/");
});
app.listen(3000,()=>{
    console.log("app is working");
});
