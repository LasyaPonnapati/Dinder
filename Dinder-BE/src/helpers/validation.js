
const validateUpdate = (fields)=>{
const ALLOWED_UPDATES = ["age", "gender", "description", "dpUrl", "skills"];
    return Object.keys(fields).every((k)=>ALLOWED_UPDATES.includes(k));
}

module.exports = {validateUpdate};