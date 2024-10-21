const express = require("express");
const connectDB = require("./config/Database");
const cookieParser = require('cookie-parser');
const authRouter = require("./Routes/auth");
const usersRouter = require("./Routes/users");
const requestRouter = require("./Routes/request");
const profileRouter = require("./Routes/profile");

const app = express();

app.use(express.json());//built-in middleware function in Express - parses incoming req ka json data 
app.use(cookieParser());//to parse cookie

app.use("/api/auth",authRouter);
app.use("/api/users",usersRouter);
app.use("/api/request",requestRouter);
app.use("/api/profile",profileRouter);

connectDB().then(()=>{
console.log("db connected");
app.listen(3000,()=>{
    console.log("server running at port 3000");  
});
}).catch((err)=>{
console.error(err);
})
