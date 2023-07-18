import http from "http";
import express from "express";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
mongoose.connect("mongodb://localhost:27017",{
    dbName:"backend",
}).then(()=>console.log("Database Connected")).catch((e)=>console.log(e));
const app=express();
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(path.resolve(),"public")));//we make public static so that index can be accessed directly
app.use(cookieParser());
app.set("view engine","ejs");  

const userSchema=new mongoose.Schema({
    password:String,
    email:String,
});

const usr=mongoose.model("User",userSchema);
const isauth=async(req,res,next)=>
{
    const {token}=req.cookies;
    if(token)
    {
        const jwtdecoded=jwt.verify(token,"secret");
        req.user=await usr.findById(jwtdecoded._id);
         
        // res.render("logout");
        next();
    }
    else{
        res.render("login");
    }
}
app.get("/",isauth,(req,res)=>{
    console.log(req.user);
    console.log(req.cookies);
    res.render("logout",{pass:req.user.password});
   

});
app.get("/add",async(req,res)=>{
   await usr.create({
        name:"aditya",
        email:"xydndgz@gmail.com",
    });
    res.send("Done");
});
app.get("/gen",(req,res)=>{
    res.render("sample");
})
app.post("/login",async(req,res)=>
{
    // cont user=await(usr.findOne(req.body.email));

   const usercreated= await usr.create({
        password:req.body.password,
        email:req.body.email,
    });
    const token=jwt.sign({_id:usercreated._id},"secret")
    console.log(req.body);
    res.cookie("token",token,{
        httpOnly: true,
        expires: new Date(Date.now()+6000),
    });
    res.redirect("/gen");
    // res.redirect("/");
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
