const AdminAuth = (req,res,next)=>{
const token = "sdjsdh";
if (token === "ssdh"){
    next();
}else{
    res.status(401).send("duefhsjfh");
}
}

module.exports = {AdminAuth};