import {useNavigate} from "react-router-dom";
import {useAuth} from "../Authentication/AuthContext.jsx";
import {useEffect, useState} from "react";

function SideBar() {

    const {logOut} = useAuth()
    const navigate = useNavigate()
    const [clicked,setClicked] = useState(localStorage.getItem("mode") === 'false')





    useEffect(() => {
        const light = () =>{
            document.querySelector(':root').style.backgroundColor= "#E8EAF6"
            document.querySelector(':root').style.color= "#3949AB"
            document.getElementById('sidebar').style.backgroundImage = "linear-gradient(to top, #F05F22, #E53F52)";
            document.getElementById('sidebar').style.color= "#090D28";
        }
        const dark = () => {
            document.querySelector(':root').style.backgroundColor= "#090D28"
            document.querySelector(':root').style.color= "#FFFFFF"
            document.getElementById('sidebar').style.backgroundColor= "#181B3A";
            document.getElementById('sidebar').style.color= "#F5F5F5";
        }
        clicked ? light() : dark();

    }, []);







    return (
        <div id="sidebar" className="darkSide">
            <div className="sidebarFirstHalfHolder">
                <a onClick={() => navigate("/main")}  className="product"></a>
                <a onClick={() => navigate("/transaction")} className="payment"></a>
            </div>
            <div className="sidebarSecondHalfHolder">
                <a className="questionsMark" onClick={() => window.location = 'mailto:Farid.Aghazada@edu.rtu.lv'}></a>
                <a onClick={() => navigate("/setting")} className="settings"></a>
                <a className="exit" onClick={logOut}></a>
            </div>
        </div>

    )
}

export default SideBar;