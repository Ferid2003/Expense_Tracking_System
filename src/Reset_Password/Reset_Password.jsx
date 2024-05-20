import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {useAuth} from "../Authentication/AuthContext.jsx";


function ResetPassword() {

    const {logOut} = useAuth()
    const [email,setEmail] = useState("")
    const [message,setMessage] = useState("")
    const {resetPassword} = useAuth()
    const [clicked,setClicked] = useState(localStorage.getItem("mode") === 'false')


    useEffect(() => {
        const light = () =>{
            document.querySelector(':root').style.backgroundColor= "#ffd7b5"
            document.querySelector(':root').style.color= "#FFFFFF"

        }
        const dark = () => {
            document.querySelector(':root').style.backgroundColor= "#090D28"
            document.querySelector(':root').style.color= "#FFFFFF"
        }
        clicked ? light() : dark();
    })
    async function handlePassChange(e){
        e.preventDefault()
        await logOut()
        try {
            setMessage("")
            await resetPassword(email)
            setMessage("Check your email for instructions!")
        }catch {
            //Something
        }
    }

    return (
        <div>
            <div className="left"></div>
            <div className="circle"></div>
            <div className="top-right"></div>
            <div className="bottom-right"></div>
            <div className="bottom-right2"></div>
            <div className="bottom-right3"></div>
            <div className="login-container">
                <div className="login-cont-holder">
                    <h1 className="title">Reset Password</h1>
                    <form className="login-form">
                        {message && <h1 className="mes-info">{message}</h1>}
                        <input onChange={(e) => setEmail(e.target.value)}  name="email" type="text" className="username" placeholder="Email"/>
                        <a onClick={handlePassChange} className={!clicked? "login loginDark":"login loginLight"}>Send email</a>
                        <strong className="redirect">Don't have an account? <Link className="redirect-link" to="/register">Click here</Link></strong>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;