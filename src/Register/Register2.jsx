import "./Register2.css"
import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../Authentication/AuthContext.jsx";


function Register2(){
    const navigate = useNavigate()
    const {logOut,signUp} = useAuth()


    const [email,setEmail] = useState()
    const [password,setPassword] = useState()
    const [rePassword,setRePassword] = useState()
    const [error,setError] = useState("")
    const [loading,setLoading] = useState(false)
    const [clicked,setClicked] = useState(localStorage.getItem("mode") === 'false')



    function handleChange(event){
        event.target.name==="username" ? setEmail(event.target.value) : setPassword(event.target.value)
    }

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

    async function register(e){
        e.preventDefault()
        await logOut()
        if (rePassword!==password){
            return setError("Passwords do not match!")
        }
        try{
            setError("")
            setLoading(true)
            await signUp(email,password)
            navigate("/name")
        }catch{
            setError("Failed to sign up!")
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
                    <h1 className="title">Register</h1>
                    {error}
                    <form className="login-form">
                        <input onChange={handleChange} name="username" type="text" className={!clicked?"email inputDark":"email inputLight"} placeholder="Email"/>
                        <input onChange={handleChange} type="text" id="password" className="password" placeholder="Password"/>
                        <input onChange={e => setRePassword(e.target.value)} type="text" id="rePassword" className="rePassword" placeholder="Re enter Password"/>
                        <button disabled={loading} onClick={register} className={!clicked? "login loginDark":"login loginLight"}>Register</button>
                        <strong className="redirect">Already have an account? <Link className="redirect-link" to="/login">Click here</Link></strong>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register2;