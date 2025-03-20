const { sendEmail } = require('./mail');
const TemporaryCollection = require('../database/temporary-model');

const otpHandler = {};

otpHandler.sendOtp = async (email) => {
    let digits = '0123456789';
    let otp = '';
    for (let i = 0; i < 6; i++ ) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    try {
        await TemporaryCollection.findOneAndReplace(
            { email: email.toLowerCase() },
            {
                email: email.toLowerCase(),
                verified: false,
                otp: otp,
                created_at: new Date()
            },
            { upsert: true }
        );

        sendEmail(
            email, 
            'OTP for Password Change',
            `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <div style="background-color: #f7f7f7; padding: 20px; border-radius: 5px; max-width: 600px; margin: auto;">
                    <h2 style="color: #007bff;">Password Change Request</h2>
                    <p style="font-size: 16px;">Hello,</p>
                    <p style="font-size: 16px;">We received a request to change your password. To proceed, please use the One-Time Password (OTP) below:</p>
                    <h3 style="background-color: #007bff; color: white; padding: 10px 15px; border-radius: 5px; display: inline-block;">${otp}</h3>
                    <p style="font-size: 16px; margin-top: 20px;">If you did not request this change, please ignore this email or contact support.</p>
                    <p style="font-size: 14px; color: #777;">Thank you for using our service!</p>
                </div>
            </div>
            `
        );
    } catch(e) {
        throw new Error("Internal server error");
    }
}

otpHandler.checkOtp = async (email, otp) => {
    try {
        const result = await TemporaryCollection.updateOne(
            { 
                email: email.toLowerCase(), 
                otp: otp 
            }, 
            { $set: { verified: true } }
        );
        if(!result.modifiedCount) throw new Error("Invalid Otp");
    } catch(e) {
        throw new Error("Internal server error");
    }
}

otpHandler.removeOtp = async (email) => {
    try {
        const result = await TemporaryCollection.deleteOne({ 
            email: email.toLowerCase() 
        });
        if(!result.deletedCount) throw new Error("The update request is not verified");
    } catch(e) {
        throw new Error("Internal server error");
    }
}

module.exports = otpHandler;
