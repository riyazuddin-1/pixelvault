import { useState } from 'react';
import { showMessage, generateOTP, verifyOtp } from '../utils';
import config from '../config.json';

const PassChange = ({ mailID, code = 0 }) => {
    var [verified, setVerified] = useState(false);
    var userMail = '';
    var otp = '';
    async function sendMail() {
        otp = generateOTP();
        var response = await fetch(config.backend_server + '/mail/send-mail', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email: mailID, otp: otp})
        });
        if(response.ok) {
            showMessage(`OTP sent to '${mailID}'`);
            userMail = mailID;
            document.getElementById('otp').disabled = false;
        } else {
            response.text().then((text)=>{
                showMessage(text ? text : 'The email ID is not authentic!');
            })
        }
    }

    function pwdMatch() {
        const submitForm = document.getElementById('submitForm');
        console.log(submitForm);
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
            submitForm.disabled = true;
        }
    }

    async function changePassword(e) {
        console.log('clicked');
        e.preventDefault();
        const Pwd = document.getElementById('passwordC');
        var response = await fetch(config.backend_server + '/auth/change-password', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email: userMail, password: Pwd.value, passType: code})
        });
        if(response.ok) {
            showMessage('password changed successfully');
            window.location.reload();
        }
    }

    return (
        <div className="content">
            <div className="passchange">
                { !verified ? <div id="otpCheck">
                <form>
                    <p>Send otp to {mailID}.<span className='link' onClick={()=>sendMail()}>Click here</span></p>
                    <label>Enter OTP</label>
                    <input type="text" id='otp' disabled/>
                    <button type="button" onClick={()=> { if(verifyOtp(otp, document.getElementById('otp').value)) setVerified(true) }}>Verify</button>
                </form>
                </div> :
                <div id="changePass">
                    <form onSubmit={changePassword}>
                        <label>New Password</label>
                        <input type="password" placeholder="New Password" id="passwordC" name='password' minLength='8' required/>
                        <span>&gt; length of password should be atleast 8</span>
                        <label>Confirm New Password</label>
                        <input type="password" placeholder="Confirm New Password" id='confirmC' name='confirmPassword' onInput={()=>pwdMatch()} required/>
                        <span id='pwdInstructionC'>&gt; both the passwords need to match</span>
                        <button type="submit" id='submitForm'>Change password</button>
                    </form>
                </div>
                }
            </div>
        </div>
     );
}
 
export default PassChange;