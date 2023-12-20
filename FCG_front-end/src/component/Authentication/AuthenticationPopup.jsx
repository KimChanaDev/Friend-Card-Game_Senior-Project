import {useState} from "react";
import { PostSignIn, PostSignUp } from "../../service/Api/ApiService.jsx";
import {Login} from "../../store/UserSlice.jsx";
import {useDispatch} from "react-redux";
import PropTypes from "prop-types";
import CookieNameEnum from "../../enum/CookieNameEnum.jsx";

AuthenticationPopup.propTypes = {
    CloseAuthenticationPopup: PropTypes.func,
    setCookie: PropTypes.func
}

export default function AuthenticationPopup({CloseAuthenticationPopup, setCookie}) {
    const [signInUsername, setSignInUsername] = useState('')
    const [signInPassword, setSignInPassword] = useState('')
    const [signUpUsername, setSignUpUsername] = useState('')
    const [signUpPassword, setSignUpPassword] = useState('')
    const [isShowSignUp, setIsShowSignUp] = useState(false)
    const dispatch = useDispatch()

    function OpenSignUp() { setIsShowSignUp(true) }
    function CloseSignUp() { setIsShowSignUp(false) }
    async function HandleLogin(e) {
        e.preventDefault()
        try{
            const user = await PostSignIn(signInUsername, signInPassword)
            SaveUserData(user)
            CloseAuthenticationPopup()
        }catch (e){
            alert("Sign in failed: " + e)
            console.log("Sign in failed: " + e)
        }
    }
    async function HandleSignUp(e){
        e.preventDefault()
        try{
            const user = await PostSignUp(signUpUsername, signUpPassword)
            SaveUserData(user)
            CloseAuthenticationPopup()
        }catch (e){
            alert("Sign up failed: " + e)
            console.log("Sign up failed: " + e)
        }
    }
    function SaveUserData(user){
        const userInfo = {
            userId: user.user.id,
            username: user.user.username,
            token: user.token
        }
        dispatch(Login(userInfo))
        setCookie(CookieNameEnum.name, userInfo, { path: "/" });
    }
    function SignInComponent(){
        return (
            <div className="popup">
                <div className="popup-inner">
                    <h2>Sign In</h2>
                    <form onSubmit={HandleLogin}>
                        <label>
                            Username / Email:
                            <input type="text" value={signInUsername} onChange={e => setSignInUsername(e.target.value)} />
                        </label>
                        <label>
                            Password:
                            <input type="password" value={signInPassword} onChange={e => setSignInPassword(e.target.value)} />
                        </label>
                        <button type="submit">Login</button>
                    </form>
                    <br/>
                    Don't have an account?
                    <br/>
                    <button onClick={OpenSignUp}> {"Sign Up"} </button>
                    <br/>
                    <button onClick={CloseAuthenticationPopup}>Close</button>
                </div>
            </div>
        )
    }

    function SignUpComponent(){
        return (
            <div className="popup">
                <div className="popup-inner">
                    <h2>Sign Up</h2>
                    <form onSubmit={HandleSignUp}>
                        <label>
                            Username / Email:
                            <input type="text" value={signUpUsername} onChange={e => setSignUpUsername(e.target.value)} />
                        </label>
                        <label>
                            Password:
                            <input type="password" value={signUpPassword} onChange={e => setSignUpPassword(e.target.value)} />
                        </label>
                        <button type="submit">Sign Up</button>
                    </form>
                    <br/>
                    Already have an account?
                    <br/>
                    <button onClick={CloseSignUp}> {"Sign In"} </button>
                    <br/>
                    <button onClick={CloseAuthenticationPopup}>Close</button>
                </div>
            </div>
        )
    }

    return (
        <>
            {
                isShowSignUp ? SignUpComponent() : SignInComponent()
            }
        </>
    )
}