
const validateUpdate = (feilds)=>{
const ALLOWED_UPDATES = ["age", "gender", "description", "dpUrl", "skills"];
    return Object.keys(feilds).every((k)=>ALLOWED_UPDATES.includes(k));
}

module.exports = {validateUpdate};