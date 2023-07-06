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

    var condition1 = false;
    var condition2 = false;
    var condition3 = false;
    async function checkIfAvailable() {
        const uidInstruction = document.getElementById('uidInstruction');
        const userID = document.getElementById('uid');
        let strRegex = new RegExp(/^[a-z0-9]+$/i);
        if(!strRegex.test(userID.value) || !userID.value) {
            uidInstruction.innerHTML = '&gt; username can only have numbers and alphabet';
            uidInstruction.style.color = 'red';
            condition1 = false;
        } else {
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
                condition1 = false;
            } else {
                uidInstruction.innerHTML = '&gt; This id is valid and available';
                uidInstruction.style.color = 'green';
                condition1 = true;
            }
        }
    }
    function pwdCheck() {
        const Pwd = document.getElementById('password');
        const pwdInstruction1 = document.getElementById('pwdInstruction1');
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
    function pwdMatch() {
        const pwdInstruction = document.getElementById('pwdInstruction2');
        const Pwd = document.getElementById('password');
        const confirmPwd = document.getElementById('confirm');
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

    var auth = 'Login';
    async function getAuth() {
        var uid = document.getElementById('uid');
        var pwd = document.getElementById('password');
        if(auth == 'Login') {
            var data = {
                uid: uid.value,
                password: pwd.value
            };
            var response = await fetch('https://tasvir-backend.vercel.app/login', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
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
        } else {
            var name = document.getElementById('name');
            var email = document.getElementById('email');
            if(name.value && uid.value && pwd.value && email.value) {
                if(condition1 && condition2 && condition3) {
                    var data = {
                        name: name.value,
                        uid: uid.value,
                        mailID: email.value,
                        password: pwd.value
                    };
                    var response = await fetch('https://tasvir-backend.vercel.app/register', {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(data)
                    })
                    cancelPrompt();
                } else {
                    showMessage('All conditions are not satisfied');
                }
            } else {
                showMessage('None of the fields should be empty');
            }
        }
    }
    var [authProcess, setAuthProcess] = useState(whatAuthProcess());
    function changeAuthProcess() {
        if(auth=='Login') {
            auth = 'Register';
        } else {
            auth = 'Login';
        }
        setAuthProcess(whatAuthProcess());
    }
    function whatAuthProcess() {
        if(auth=='Register') {
            return (
                <div className="popup">
                    <p className="msgField" id='messageField1'></p>
                    <form>
                        <p>{ auth }</p>
                        <input type='text' placeholder='Full name' id='name' name='name'/>
                        <input type="text" placeholder="Desired Username" id="uid" name='uid' onInput={()=>checkIfAvailable()}/>
                        <span id='uidInstruction'>&gt; username can only have numbers and alphabet</span>
                        <input type="email" placeholder='Email' id='email'/>
                        <input type="password" placeholder="Password" id="password" name='password' onInput={()=>pwdCheck()}/>
                        <span id='pwdInstruction1'>&gt; length of password should be atleast 8</span>
                        <input type="password" placeholder="Confirm Password" id='confirm' name='confirmPassword' onInput={()=>pwdMatch()}/>
                        <span id='pwdInstruction2'>&gt; both the passwords need to match</span>
                        <button type="button" onClick={() => getAuth()}>{ auth }</button>
                    </form>
                    <p>already a user? <span onClick={ () => changeAuthProcess() }>Login</span></p>
                </div>
            )
        } else {
            return (
                <div className="popup">
                    <p className="msgField" id='messageField1'></p>
                    <form>
                        <p>{ auth }</p>
                        <input type="text" placeholder="Username" id='uid' name="uid"/>
                        <input type="password" placeholder="Password" id="password"/>
                        <p>Forgot Password?<span onClick={() => window.location = '/forgotPassword'}>Click here</span></p>
                        <button type="button" onClick={() => getAuth()}>{ auth }</button>
                    </form>
                    <p>new user? <span onClick={ () => changeAuthProcess() }>Register</span></p>
                </div>
            )
        }
    }
    return ( 
        <div id="navRight">
            <button onClick={ () => authPrompt() }>Sign in</button>
            <div id="backdrop" onClick={ ()=> cancelPrompt() }></div>
            <div id='authpopup'>
                { authProcess }
            </div>
        </div>
     );
}
 
export default Authentication;