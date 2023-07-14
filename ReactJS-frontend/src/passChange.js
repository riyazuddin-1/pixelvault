const PassChange = ({code}) => {
    function showMessage(message) {
        const msgField = document.getElementById('messageField3');
        msgField.style.display = 'block';
        msgField.innerHTML = message;
        setTimeout(()=>{
            msgField.style.display = 'none';
        }, 10000)
    }
    function generateOTP() {
        var digits = '0123456789';
        var OTP = '';
        for (let i = 0; i < 6; i++ ) {
            OTP += digits[Math.floor(Math.random() * 10)];
        }
        return OTP;
    }
    var userMail = '';
    var otp = '';
    async function sendMail() {
        var mail = document.getElementById('usermail');
        otp = generateOTP();
        var response = await fetch('https://tasvir-backend.vercel.app/sendmail', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email: mail.value, otp: otp})
        });
        if(response.ok) {
            showMessage(`OTP sent to '${mail.value}'`);
            userMail = mail.value;
            document.getElementById('otp').disabled = false;
        } else {
            response.text().then((text)=>{
                showMessage(text ? text : 'The email ID is not authentic!');
            })
        }
    }

    function verifyOtp() {
        if(otp === document.getElementById('otp').value) {
            document.getElementById('otpCheck').style.display = 'none';
            document.getElementById('changePass').style.display = 'block';
        } else {
            showMessage("The OTP does not match");
        }
    }
    const submitForm = document.getElementById('submitForm');
    function pwdMatch() {
        const pwdCInstruction = document.getElementById('pwdInstructionC');
        const Pwd = document.getElementById('passwordC');
        const confirmPwd = document.getElementById('confirmC');
        if(Pwd.value === confirmPwd.value) {
            pwdCInstruction.innerHTML = '&gt; Passwords match';
            pwdCInstruction.style.color = 'green';
            submitForm.disabled = false;
        } else {
            pwdCInstruction.innerHTML = '&gt; Passwords do not match';
            pwdCInstruction.style.color = 'red';
            submitForm.disabled = true
        }
    }

    async function changePassword(e) {
        e.preventDefault();
        const Pwd = document.getElementById('passwordC');
        var response = await fetch('https://tasvir-backend.vercel.app/changepassword', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email: userMail, password: Pwd.value, passType: code})
        });
        if(response.ok) {
            showMessage('password changed successfully');
            window.location = '/';
        }
    }

    return (
        <div className="content">
            <p className="msgField" id='messageField3'></p>
            <div className="passchange">
                <div id="otpCheck">
                <form>
                    <label>Email</label>
                    <input type="email" id='usermail'/>
                    <p>Send otp to given email. <span style={{color:'blue', cursor: 'pointer'}} onClick={()=>sendMail()}>Click here</span></p>
                    <label>Enter OTP</label>
                    <input type="text" id='otp' disabled/>
                    <button type="button" onClick={()=> verifyOtp()}>Verify</button>
                </form>
                </div>
                <div id="changePass">
                <form onSubmit={changePassword}>
                    <label>New Password</label>
                    <input type="password" placeholder="New Password" id="passwordC" name='password' minLength='8' required/>
                    <span>&gt; length of password should be atleast 8</span>
                    <label>Confirm New Password</label>
                    <input type="password" placeholder="Confirm New Password" id='confirmC' name='confirmPassword' onInput={()=>pwdMatch()} required/>
                    <span id='pwdInstructionC'>&gt; both the passwords need to match</span>
                    <button type="button" id='submitForm' disabled>Change password</button>
                </form>
                </div>
            </div>
        </div>
     );
}
 
export default PassChange;