const express = require("express");

const app = express();

app.use("/Hello",(req,res)=>{res.send("Hello !")});

app.listen(3000,()=>{
    console.log("server running");  
});