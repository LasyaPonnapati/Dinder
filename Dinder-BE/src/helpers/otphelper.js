const nodemailer = require("nodemailer"); 

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "lasyaponnapati@gmail.com",//emailId of the email from which you want to send the email
      pass: "tylqpuvtsxqncxah",//password
    },  
});

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);
};

const sendOTPtoEmail = (otpGenerated, user, res) =>{
    const mailOptions = {
        from: "lasyaponnapati@gmail.com",//from emailId
        to: user.emailId,
        subject: "Your Password Reset OTP",
        text: `Your OTP for password reset is: ${otpGenerated}. It is valid for 5 minutes.`,
    };
    transporter.sendMail(mailOptions, () => {
        res.status(200).json({message: "OTP sent successfully"});
    });
};

const validateOTP = (userEnteredOTP,systemSavedOTPModel) => {
    const isOTPsMatching = userEnteredOTP === systemSavedOTPModel.otp;
    return (isOTPsMatching && !systemSavedOTPModel.isValidated && systemSavedOTPModel.expires >= Date.now())
};

module.exports = {sendOTPtoEmail, generateOTP, validateOTP};