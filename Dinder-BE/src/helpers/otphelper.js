const nodemailer = require("nodemailer"); 

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "lasyaponnapati@gmail.com",
      pass: "tylqpuvtsxqncxah",
    },
});

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);
};

const sendOTPtoEmail = (otpRefer, user, res) =>{
    const mailOptions = {
        from: "lasyaponnapati@gmail.com",
        to: user.emailId,
        subject: "Your Password Reset OTP",
        text: `Your OTP for password reset is: ${otpRefer.otp}. It is valid for 5 minutes.`,
    };
    transporter.sendMail(mailOptions, () => {
        res.send("OTP sent successfully");
    });
};

const validateOTP = (userEnteredOTP,systemSavedOTPModel) => {
    return (userEnteredOTP === systemSavedOTPModel.otp && !systemSavedOTPModel.isValidated && systemSavedOTPModel.expires > Date.now())
};

module.exports = {sendOTPtoEmail, generateOTP, validateOTP};