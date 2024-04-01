import { useState } from "react";
import { showMessage, setAuthCredentials } from "../utils";
import Popup from "./popup";
import PassChange from "./passChange";
import config from '../config.json';

const ChangePasswordNav = ({ changeAuthForm }) => {
    return (
        <>
            <span className="link" onClick={() => changeAuthForm("login") }>&lt; back</span>
            <PassChange/>
        </>
    )
}

const Login = ({ handleSubmit, changeAuthForm }) => {
    return (
        <form name="login" onSubmit={handleSubmit}>
            <p>Login</p>
            <input type="text" placeholder="Username" id='uid' name="uid" required/>
            <input type="password" placeholder="Password" id="password" name="password" required/>
            <p>Forgot Password?<span className="link" onClick={() => changeAuthForm("change_password")}>Click here</span></p>
            <button type="submit">Login</button>
            <p>new user?<span className="link" onClick={ () => changeAuthForm("register") }>Register</span></p>
        </form>
    )
}

const Register = ({ handleSubmit, changeAuthForm }) => {
    async function checkIfAvailable() {
        var registerBtn = document.getElementById('registerBtn');
        const uidInstruction = document.getElementById('uidInstruction');
        const userID = document.getElementById('uid');
        let strRegex = new RegExp(/^[a-z0-9]+$/i);
        if(strRegex.test(userID.value) && userID.value) {
            var result = await fetch(config.backend_server + '/auth/check-username', {
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
                name="email"
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
            <button type="submit" id="registerBtn">Register</button>
            <p>already a user?<span className="link" onClick={ () => changeAuthForm("login") }>Login</span></p>
        </form>
    )
}

const Authentication = () => {
    var [authForm, setAuthForm] = useState("login");

    const authComponents = {
        "login": <Login handleSubmit={handleSubmit} changeAuthForm={changeAuthForm}/>,
        "register": <Register handleSubmit={handleSubmit} changeAuthForm={changeAuthForm}/>,
        "change_password": <ChangePasswordNav changeAuthForm={changeAuthForm}/>
    }

    function changeAuthForm(component) {
        setAuthForm(component);
    }

    async function handleSubmit(e) {
        console.log('clicked');
        e.preventDefault();
        var form = e.currentTarget;
        var submitTo = config.backend_server + '/auth/' + (form.name);
        console.log(submitTo);
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
            console.log(response);
            var result = await response.text();
            showMessage(result);
        } else {
            response.json().then((r)=> {
                setAuthCredentials(r);
            })
        }
    }

    return ( 
        <div>
            <Popup popupPlaceholder={"Sign In"} popupComponent={ authComponents[authForm] }/>
        </div>
     );
}
 
export default Authentication;