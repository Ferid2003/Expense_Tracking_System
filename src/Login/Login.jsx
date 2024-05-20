import "./Login.css"
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {usersCollection} from "../Firebase.js";
import {
    onSnapshot
} from "firebase/firestore"
import {useAuth} from "../Authentication/AuthContext.jsx";


function Login(){
    let navigate = useNavigate();
    let user = null
    const {login,logOut} = useAuth()
    const [see,setSee] = useState(false)
    const [userName,setUserName] = useState("")
    const [password,setPassword] = useState("")
    const [users,setUsers] = useState([])
    const [clicked,setClicked] = useState(localStorage.getItem("mode")==='false')

    function toggleSee(){
        setSee(document.getElementById("password").type === "password")
    }

    async function handleChange(event){
        event.target.name==="username" ? setUserName(event.target.value) : setPassword(event.target.value);

    }

    useEffect(() => {
        const unsubscribe = onSnapshot(usersCollection, function(snapshot) {
            // Sync up our local notes array with the snapshot data
            const usersArr = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            const light = () =>{
                document.querySelector(':root').style.backgroundColor= "#ffd7b5"
                document.querySelector(':root').style.color= "#FFFFFF"

            }
            const dark = () => {
                document.querySelector(':root').style.backgroundColor= "#090D28"
                document.querySelector(':root').style.color= "#FFFFFF"
            }
            clicked ? light() : dark();
            setUsers(usersArr)

        })
        return unsubscribe
    }, [])


    async function checkUser(event){
        event.preventDefault()
        await  logOut()
        for(let i =0; i<users.length; i++){
            if(users[i].username===userName && password!==""){
                user = users[i]
                try {
                    await login(user.email,password)
                }catch {
                    window.alert("Password or Username is incorrect!")
                }
                navigate('/main');
            }
        }
        if(user===null){
            window.alert("Password or Username is incorrect!")
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
                    <h1 className="title">Login</h1>
                    <form className="login-form">
                        <input onChange={handleChange} name="username"  className="username" placeholder="Username"/>
                        <input onChange={handleChange} type={see ? "text" : "password"} id="password" className="password" placeholder="Password"/>
                        <Link to="/reset-password" className="resetPas">Forgot Password?</Link>
                        {password && <i onClick={toggleSee} className="fa-solid fa-eye" id="eye"></i>}
                        {password && <i onClick={toggleSee} className="fa-solid fa-eye fa-xs qaqa" id="eye2"></i>}
                        <a onClick={checkUser}  className={!clicked? "login loginDark":"login loginLight"}>Login</a>
                        <strong className="redirect">Don't have an account? <Link className="redirect-link" to="/register">Click here</Link></strong>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;