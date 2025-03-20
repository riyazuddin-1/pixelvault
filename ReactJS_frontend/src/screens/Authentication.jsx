import { useEffect, useState } from "react";
import { showMessage, setCookie, setAuthCredentials, getCookie, isSignedIn, getStorage, setStorage, names } from "../utils";
import config from '../config.json';
import { DragAndDrop } from "../components/DragAndDrop";
import { useLocation } from "react-router-dom";

const validateForm = (formName, data) => {
    let errors = {};
    if (formName === "login") {
        if (!data.uid) errors.uid = "Unique ID is required";
        if (!data.password) errors.password = "Password is required";
    } else if (formName === "register") {
        if (!data.fullname) errors.fullname = "Full name is required";
        if (!data.about) errors.about = "Your information is required";
        if (errors && !errors.uid) if(!data.uid.match(/^[a-z0-9]+$/i)) errors.uid = "Unique ID must be alphanumeric";
        if (!data.email || !(data.email.length > 5) || !data.email.includes("@") || !data.email.includes(".")) errors.email = "Invalid email address";
        if (data.password.length < 8) errors.password = "Password must be at least 8 characters";
        if (data.password !== data.confirmPassword) errors.confirmPassword = "Passwords do not match";
    }else if (formName === "update-profile") {
        if (!data.fullname) errors.fullname = "Full name is required";
        if (!data.about) errors.about = "Your information is required";
        if (errors && !errors.uid) if(!data.uid.match(/^[a-z0-9]+$/i)) errors.uid = "Unique ID must be alphanumeric";
        if (!data.email || !(data.email.length > 5) || !data.email.includes("@") || !data.email.includes(".")) errors.email = "Invalid email address";
    } else if(formName == "update-password") {
        if (data.password.length < 8) errors.password = "Password must be at least 8 characters";
        if (data.password !== data.confirmPassword) errors.confirmPassword = "Passwords do not match";
    }
    return errors;
};

const ForgotPassword = ({handleSubmit, errors, submitting, changeAuthForm}) => {
    const [data, setData] = useState(null);
    const [process, setProcess] = useState(1);
    const [processing, setProcessing] = useState(false);

    const verifyEmail = async (e = null) => {
        setProcessing(true);
        if(e) e.preventDefault();
        try {
            const res = await fetch(`${config.backend_server}/auth/verify-email`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({email: data})
            });
            showMessage(await res.text(), res.ok ? "info": "warning");
            if(res.ok) {
                setProcess(2);
            }
        } catch (e) {
            showMessage("Failed to establish connection");
        }
        setProcessing(false);
    }

    const verifyOtp = async (e) => {
        setProcessing(true);
        e.preventDefault();
        try {
            const res = await fetch(`${config.backend_server}/auth/verify-otp`, {
                method: 'POST',
                body: new FormData(e.currentTarget)
            });
            if(res.ok) {
                setProcess(3);
            } else showMessage(await res.text(), "warning");
        } catch (e) {
            showMessage("Failed to establish connection", "warning");
        }
        setProcessing(false);
    }

    return (
        <div>
            <span className="highlight" onClick={() => changeAuthForm("login")}>
                ◀ back to login
            </span>
            <h1>Change Password</h1>
            {
                process == 1 ?
                <form name="verify-email" onSubmit={verifyEmail}>
                    <label>Enter email</label>
                    <input type="email" placeholder='example@domain.com' id='email' name="email" onChange={(e) => setData(e.currentTarget.value)}/>
                    <p className="notify">
                        Info: Enter your email to receive a one-time password (OTP) for verification.
                    </p>
                    <button className="btn-primary my-m" type="submit" disabled={processing}>Send Otp</button>
                </form> 
                : process == 2 ?
                <form name="verify-otp" onSubmit={verifyOtp}>
                    <input name="email" value={data} readOnly/>
                    <label>Enter OTP</label>
                    <input type="text" placeholder='e.g.: 123456' id='otp' name="otp" />
                    <p className="notify">
                        Info: Enter the OTP sent to your email to proceed.
                    </p>
                    <p>Did not receive? <span className="highlight" onClick={()=>verifyEmail()}>resend</span></p>
                    <button className="btn-primary my-m" type="submit" disabled={processing}>Verify Otp</button>
                </form> 
                :
                <form name="update-password" onSubmit={handleSubmit}>
                    <input name="email" value={data} readOnly/>
                    <div>
                        <label htmlFor="password">Enter password</label>
                        <input type="password" placeholder="Password" id="password" name='password' />
                        {errors.password && <p className="error">{errors.password}</p>}
                    </div>
                    <div>
                        <label htmlFor="confirmPassword">Confirm password</label>
                        <input type="password" placeholder="Retype Password" id='confirm' name='confirmPassword' />
                        {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
                    </div>
                    <p className="notify">
                        Info: Set a new password to secure your account.
                    </p>
                    <button className="btn-primary my-m" type="submit" disabled={submitting}>Update</button>
                </form>
            }
        </div>
    )
}

const Login = ({ handleSubmit, errors, submitting, changeAuthForm }) => (
    <form name="login" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <div>
            <label htmlFor="uid">Enter Unique Id</label>
            <input type="text" placeholder="e.g.: rx100" id='uid' name="uid" />
            {errors.uid && <p className="error">{errors.uid}</p>}
        </div>
        <div>
            <label htmlFor="password">Enter Password</label>
            <input type="password" placeholder="Password" id="password" name="password" />
            {errors.password && <p className="error">{errors.password}</p>}
        </div>
        <p>
            Forgot Password?
            <span className="highlight" onClick={() => changeAuthForm("change_password")}>
                Click here
            </span>
        </p>
        <button className="btn-primary my-m" type="submit" disabled={submitting}>Login</button>
        <p>
            New user?
            <span className="highlight" onClick={() => changeAuthForm("register")}>Register</span>
        </p>
    </form>
);

const Register = ({ handleChange, handleSubmit, errors, submitting, checkUid, changeAuthForm, userData }) => {
    const isUpdate = Boolean(userData);

    useEffect(() => {
        if(userData && userData.picture)
            handleChange("picture", userData.picture);
    }, []);

    return (
        <form name={ isUpdate ? "update-profile" : "register"} onSubmit={handleSubmit}>
            <h1>{isUpdate ? "Update Profile" : "Register"}</h1>
            <div>
                <label>Profile picture</label>
                {errors.picture && <p className="error">{errors.picture}</p>}
                <DragAndDrop defaultValue={userData?.picture} onFileSelect={(file) => handleChange("picture", file)} placeholder={"DP"} />
            </div>
            <div>
                <label htmlFor="fullname">Full name</label>
                <input 
                    type='text' 
                    placeholder='e.g.: Kakashi Hatake' 
                    id='fullname' 
                    name='fullname' 
                    defaultValue={userData?.fullname || ''} 
                />
                {errors.fullname && <p className="error">{errors.fullname}</p>}
            </div>
            <div>
                <label htmlFor="about">About Me</label>
                <textarea 
                    placeholder='e.g.: I am an artist' 
                    id='about' 
                    name='about' 
                    defaultValue={userData?.about || ''} 
                />
                {errors.about && <p className="error">{errors.about}</p>}
            </div>
            <div>
                <label htmlFor="uid">Unique Id</label>
                <input 
                    type="text" 
                    placeholder="Create a unique id" 
                    id="uid" 
                    name='uid' 
                    defaultValue={userData?.uid || ''} 
                    onChange={checkUid} 
                    // disabled={isUpdate}  // Disable for update
                />
                {errors.uid && <p className="error">{errors.uid}</p>}
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <input 
                    type="email" 
                    placeholder='Unique email required' 
                    id='email' 
                    name="email" 
                    defaultValue={userData?.email || ''} 
                />
                {errors.email && <p className="error">{errors.email}</p>}
            </div>
            {!isUpdate && (
                <>
                    <div>
                        <label htmlFor="password">Enter password</label>
                        <input 
                            type="password" 
                            placeholder="Password" 
                            id="password" 
                            name='password' 
                        />
                        {errors.password && <p className="error">{errors.password}</p>}
                    </div>
                    <div>
                        <label htmlFor="confirmPassword">Confirm password</label>
                        <input 
                            type="password" 
                            placeholder="Retype Password" 
                            id='confirm' 
                            name='confirmPassword' 
                        />
                        {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
                    </div>
                </>
            )}
            <button className="btn-primary w-full my-m" type="submit" disabled={submitting}>
                {isUpdate ? "Update Profile" : "Register"}
            </button>
            <p>
                {isUpdate ? (
                    "Want to switch to login?"
                ) : (
                    "Already a user?"
                )}
                <span className="highlight" onClick={() => changeAuthForm("login")}>
                    {isUpdate ? "Login" : "Login"}
                </span>
            </p>
        </form>
    );
};

const Authentication = () => {
    const [errors, setErrors] = useState({});
    const [authForm, setAuthForm] = useState("login");
    const [addToForm, setAddToForm] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const location = useLocation();
    const profile = location.state?.profile;

    async function checkUid(e) {
        const value = e.currentTarget.value;
        if(!value || (value && !value.length)) {
            setErrors({...errors, uid: "Unique ID is required"});
            return;
        } else if(!value.match(/^[a-z0-9]+$/i)) {
            setErrors({...errors, uid: "Unique ID must be alphanumeric"});
            return;
        } else if(profile && value == profile.uid) {
            let { uid, ...rest } = errors;
            setErrors(rest);
            return;
        }
        let { uid, ...rest } = errors;
        setErrors(rest);
        const result = await fetch(config.backend_server + '/auth/check-username', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ uid: value })
        });
        if(!result.ok) {
            setErrors({...errors, uid: `The ID ${value} is already taken`});
        }
    }

    function handleChange(key, value) {
        setAddToForm({...addToForm, [key]: value});
    }

    async function handleSubmit(e) {
        setSubmitting(true);
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        Object.entries(addToForm).forEach(([key, value]) => {
            formData.append(key, value);
        });
        const validationErrors = validateForm(form.name, Object.fromEntries(formData.entries()));
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) {
            setSubmitting(false);
            return;
        }
        const submitTo = `${config.backend_server}/auth/${form.name}`;
        const requestHeader = {};
        if(form.name == 'update-profile') {
            if(!isSignedIn) {
                showMessage("Login in before updating profile", "warning");
                return;
            } else requestHeader["authorization"] = `Bearer ${getStorage(names.token)}`;
        }
        try {
            let response = await fetch(submitTo, {
                method: "POST",
                headers: requestHeader,
                body: formData,
            });
            if (!response.ok) {
                let result = await response.text();
                showMessage(result);
                setSubmitting(false);
            } else {
                let result = await response.json();
                setStorage(names.token, result.token);
                setStorage(names.user, JSON.stringify(result.user));
                window.location = '/explore';
            }
        } catch (error) {
            showMessage("Network error, please try again", "warning");
            setSubmitting(false);
        }
    }

    useEffect(() => {
        if(profile)
        setAuthForm("register");
    }, []);

    useEffect(() => setErrors({}), [authForm]);

    return <div className="form-wrapper">
        { authForm === "login" ? 
            <Login handleSubmit={handleSubmit} errors={errors} submitting={submitting} changeAuthForm={setAuthForm} />
         : authForm === "register" ? 
         <Register handleChange={handleChange} handleSubmit={handleSubmit} errors={errors} submitting={submitting} checkUid={checkUid} changeAuthForm={setAuthForm} userData={profile}/>
          : <ForgotPassword handleSubmit={handleSubmit} errors={errors} submitting={submitting} changeAuthForm={setAuthForm}/>
        }
        </div>;
};

export default Authentication;