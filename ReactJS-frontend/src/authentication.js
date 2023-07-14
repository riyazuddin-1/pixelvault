import { useState } from "react";

const Authentication = ({funcAuthCred}) => {
    function authPrompt() {
        document.getElementById('authpopup').style.display = 'block';
        document.getElementById('backdrop').style.display = 'block';
    }
    function cancelPrompt() {
        document.getElementById('authpopup').style.display = 'none';
        document.getElementById('backdrop').style.display = 'none';
    }

    function showMessage(message) {
        const msgField = document.getElementById('messageField1');
        msgField.style.display = 'block';
        msgField.innerHTML = message;
        setTimeout(()=>{
            msgField.style.display = 'none';
        }, 10000)
    }

    var [authForm, setAuthForm] = useState(<Login/>);
    async function handleSubmit(e) {
        e.preventDefault();
        var form = e.currentTarget;
        var submitTo = 'https://tasvir-backend.vercel.app/' + (form.name);
        const formData = new FormData(form);
        const plainFormData = Object.fromEntries(formData.entries());
        const jsonDataString = JSON.stringify(plainFormData);
        var response = await fetch(submitTo, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: jsonDataString
        })
        if(!response.ok) {
            var result = await response.text();
            showMessage(result);
        } else {
            response.json().then((r)=> {
                funcAuthCred(r);
            })
            cancelPrompt();
        }
    }

    async function checkIfAvailable() {
        var registerBtn = document.getElementById('registerBtn');
        const uidInstruction = document.getElementById('uidInstruction');
        const userID = document.getElementById('uid');
        let strRegex = new RegExp(/^[a-z0-9]+$/i);
        if(strRegex.test(userID.value) && userID.value) {
            var result = await fetch('https://tasvir-backend.vercel.app/checkUsername', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ uid: userID.value })
            })
            if(!result.ok) {
                uidInstruction.innerHTML = '&gt; This id is not available';
                uidInstruction.style.color = 'red';
                registerBtn.disabled = true;
            } else {
                uidInstruction.innerHTML = '&gt; This id is valid and available';
                uidInstruction.style.color = 'green';
                registerBtn.disabled = false;
            }
        } else {
            uidInstruction.innerHTML = '&gt; username can only have numbers and alphabet';
            uidInstruction.style.color = 'red';
            registerBtn.disabled = true;
        }
    }
    function pwdMatch() {
        var registerBtn = document.getElementById('registerBtn');
        const pwdInstruction = document.getElementById('pwdInstruction');
        const Pwd = document.getElementById('password');
        const confirmPwd = document.getElementById('confirm');
        if(Pwd.value === confirmPwd.value) {
            pwdInstruction.innerHTML = '&gt; Passwords match';
            pwdInstruction.style.color = 'green';
            registerBtn.disabled = false;
        } else {
            pwdInstruction.innerHTML = '&gt; Passwords do not match';
            pwdInstruction.style.color = 'red';
            registerBtn.disabled = true;
        }
    }

    function Login() {
        return (
            <form name="login" onSubmit={handleSubmit}>
                <p>Login</p>
                <input type="text" placeholder="Username" id='uid' name="uid" required/>
                <input type="password" placeholder="Password" id="password" required/>
                <p>Forgot Password?<span onClick={() => window.location = '/forgotPassword'}>Click here</span></p>
                <button type="submit">Login</button>
                <p>new user? <span onClick={ () => setAuthForm(<Register/>) }>Register</span></p>
            </form>
        )
    }
    function Register() {
        return (
            <form name="register" onSubmit={handleSubmit}>
                <p>Register</p>
                <input type='text'
                    placeholder='Full name'
                    id='fullname'
                    name='fullname'
                    required
                />
                <input type="text"
                    placeholder="Desired Username/UserId"
                    id="uid"
                    name='uid'
                    onInput={()=>checkIfAvailable()}
                    maxLength='15'
                    required
                />
                <span id='uidInstruction'>&gt; username can only have numbers and alphabet</span>
                <input type="email"
                    placeholder='Email'
                    id='email'
                    required
                />
                <input type="password"
                    placeholder="Password" 
                    id="password"
                    name='password'
                    minLength='8'
                    required
                />
                <input type="password"
                    placeholder="Confirm Password" 
                    id='confirm'
                    name='confirmPassword'
                    onInput={()=>pwdMatch()}
                    required
                />
                <span id='pwdInstruction'>&gt; both the passwords need to match</span>
                <button type="submit" id="registerBtn" disabled>Register</button>
                <p>already a user? <span onClick={ () => setAuthForm(<Login/>) }>Login</span></p>
            </form>
        )
    }

    return ( 
        <div id="navRight">
            <button onClick={ () => authPrompt() }>Sign in</button>
            <div id="backdrop" onClick={ ()=> cancelPrompt() }></div>
            <div id='authpopup' className="popup">
                <p className="msgField" id='messageField1'></p>
                { authForm }
            </div>
        </div>
     );
}
 
export default Authentication;