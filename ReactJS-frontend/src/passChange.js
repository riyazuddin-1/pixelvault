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
        let OTP = '';
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
        var res = await fetch('https://tasvir-backend.vercel.app/sendmail', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email: mail.value, otp: otp})
        });
        if(res.ok) {
            showMessage(`OTP sent to '${mail.value}'`);
            userMail = mail.value;
            document.getElementById('otp').disabled = false;
        } else {
            res.text().then((text)=>{
                showMessage(text ? text : 'The email ID is not authentic!');
            })
        }
    }

    function verifyOtp() {
        alert(otp, document.getElementById('otp').value);
        if(otp === document.getElementById('otp').value) {
            document.getElementById('otpCheck').style.display = 'none';
            document.getElementById('changePass').style.display = 'block';
        } else {
            showMessage("The OTP does not match");
        }
    }
    var condition2 = false;
    
    function pwdCheck() {
        const Pwd = document.getElementById('passwordC');
        const pwdInstruction1 = document.getElementById('pwdInstructionC');
        if(Pwd.value.length < 8) {
            pwdInstruction1.innerHTML = '&gt; length of password should be atleast 8';
            pwdInstruction1.style.color = 'red';
            condition2 = false;
        } else {
            pwdInstruction1.innerHTML = '&gt; password is valid';
            pwdInstruction1.style.color = 'green';
            condition2 = true;
        }
    }
    var condition3 = false;
    function pwdMatch() {
        const pwdInstruction = document.getElementById('pwdInstructionC2');
        const Pwd = document.getElementById('passwordC');
        const confirmPwd = document.getElementById('confirmC');
        if(Pwd.value === confirmPwd.value) {
            pwdInstruction.innerHTML = '&gt; Passwords match';
            pwdInstruction.style.color = 'green';
            condition3 = true
        } else {
            pwdInstruction.innerHTML = '&gt; Passwords do not match';
            pwdInstruction.style.color = 'red';
            condition3 = false;
        }
    }

    async function changePassword() {
        const Pwd = document.getElementById('passwordC');
        if(condition2 && condition3) {
            var report = await fetch('https://tasvir-backend.vercel.app/changepassword', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email: userMail, password: Pwd.value, passsType: code})
            });
            if(report.ok) {
                showMessage('pass changed successfully');
                window.location = '/';
            }
        } else {
            showMessage('The passwords do not satisfy given conditions');
        }
    }

    return (
        <div className="content">
            <p className="msgField" id='messageField3'></p>
            <div id="otpCheck" className="passchange">
                <form>
                    <div>
                        <label>Email</label>
                        <input type="email" id='usermail'/>
                    </div>
                    <p>Send otp to given email. <span style={{color:'blue', cursor: 'pointer'}} onClick={()=>sendMail()}>Click here</span></p>
                    <div>
                        <label>Enter OTP</label>
                        <input type="text" id='otp' disabled/>
                    </div>
                    <button type="button" onClick={()=> verifyOtp()}>Verify</button>
                </form>
            </div>
            <div id="changePass" className="passchange">
                <form>
                    <label>New Password</label>
                    <input type="password" placeholder="New Password" id="passwordC" name='password' onInput={()=>pwdCheck()}/>
                    <span id='pwdInstructionC'>&gt; length of password should be atleast 8</span>
                    <label>Confirm New Password</label>
                    <input type="password" placeholder="Confirm New Password" id='confirmC' name='confirmPassword' onInput={()=>pwdMatch()}/>
                    <span id='pwdInstructionC2'>&gt; both the passwords need to match</span>
                    <button type="button" onClick={()=> changePassword()}>Change password</button>
                </form>
            </div>
        </div>
     );
}
 
export default PassChange;