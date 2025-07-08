const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require('cookie-parser');
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const requestRouter = require("./routes/request");
const profileRouter = require("./routes/profile");

const app = express();

app.use(express.json()); 
app.use(cookieParser());

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
