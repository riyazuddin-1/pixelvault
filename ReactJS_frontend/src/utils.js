var cryptoJS = require('crypto-js');
const config = require('./config.json');

const utilities = {}

utilities.getAuthCredentials = () => {
    const authCred = sessionStorage.getItem('Credentials');
    var bytesString = cryptoJS.AES.decrypt(authCred, config.encryption_key).toString(cryptoJS.enc.Utf8);
    return JSON.parse(bytesString);
}

utilities.setAuthCredentials = (data) => {
    sessionStorage.setItem('Credentials', cryptoJS.AES.encrypt(JSON.stringify(data), config.encryption_key).toString());
    window.location.reload();
}

utilities.isSignedIn = sessionStorage.getItem('Credentials') ? true : false;

utilities.showMessage = (message) => {
    const msgField = document.getElementById('messageField');
    msgField.style.display = 'block';
    msgField.innerHTML = message;
    setTimeout(()=>{
        msgField.style.display = 'none';
    }, 10000)
}

utilities.generateOTP = () => {
    var digits = '0123456789';
    var OTP = '';
    for (let i = 0; i < 6; i++ ) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

utilities.verifyOtp = (otp, val) => {
    return otp.length ? otp==val : false;
}

module.exports = utilities;