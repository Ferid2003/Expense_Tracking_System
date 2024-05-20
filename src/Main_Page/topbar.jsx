import {useEffect, useState} from "react";
import Switch from "@mui/material/Switch";
import logo from '../images/logo.svg';
import {useNavigate} from "react-router-dom";
import {useAuth} from "../Authentication/AuthContext.jsx";
function TopBar() {

    const {us} = useAuth()
    const navigate = useNavigate()
    const [clicked,setClicked] = useState(localStorage.getItem("mode") === 'false')
    const [style,setStyle] = useState({backgroundImage: "url(" + "https://www.pngmart.com/files/23/User-PNG-Isolated-Image.png" + ")",
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "48px",
        height: "50px",
        width: "50px",
        marginRight: "12px",
        marginLeft: "12px",
        cursor: "pointer",
        transition: 'opacity 0.3s ease'
    })

    useEffect(() => {
        function getAvatarWidth() {
            if(window.innerWidth >= 550){
                return 50;
            }else {
                return 35;
            }
        }
        setStyle({backgroundImage: "url(" + "https://www.pngmart.com/files/23/User-PNG-Isolated-Image.png" + ")",
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "48px",
            height: `${getAvatarWidth()}px`,
            width: `${getAvatarWidth()}px`,
            marginRight: "12px",
            marginLeft: "12px",
            cursor: "pointer",
            transition: 'opacity 0.3s ease'
        })
        async function sui(){
            const data = await us.data()
            setStyle({
                backgroundImage: "url(" + data.profile_pic + ")",
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: "48px",
                height: `${getAvatarWidth()}px`,
                width: `${getAvatarWidth()}px`,
                marginRight: "12px",
                marginLeft: "12px",
                cursor: "pointer",
                transition: 'opacity 0.3s ease'
            })
        }
        sui()
    },[us])


    function toggleDarkMode(e){
        e.preventDefault()
        localStorage.removeItem("mode")
        localStorage.setItem("mode",clicked.toString())

        const light = () => {
            document.body.style.backgroundColor = "#ffd7b5";
            document.body.style.color = "#ffffff";
            document.getElementById('navbar').style.backgroundColor= "#ffd7b5"
            document.getElementById('navbar').style.color= "#090D28"
            document.getElementById('sidebar').style.backgroundImage = "linear-gradient(to top, #F05F22, #E53F52)";
            document.getElementById('sidebar').style.color= "#090D28";
            document.getElementById('nightMode').style.color= "#F05F22";
            document.getElementById('logo').style.filter = "invert(55%) sepia(40%) saturate(6529%) hue-rotate(348deg) brightness(96%) contrast(95%)";
            if (document.getElementById('form-container')){
                document.getElementById('form-container').style.backgroundColor= "#ffb38a"
                document.getElementById('submitBTN').backgroundImage = "linear-gradient(to top, #F05F22, #E53F52)";
            }
            if(document.getElementById('chart1')){
                document.getElementById('chart1').style.backgroundColor = "#ffb38a";
                document.getElementById('chart2').style.backgroundColor = "#ffb38a";
                document.getElementById('reports').style.backgroundColor = "#ffb38a";
            }

        }
        const dark = () =>{
            document.body.style.backgroundColor = "#090D28";
            document.body.style.color = "#F5F5F5";
            document.getElementById('navbar').style.backgroundColor= "#090D28"
            document.getElementById('navbar').style.color= "#F5F5F5"
            document.getElementById('sidebar').style.backgroundImage = "linear-gradient(to top, #181B3A, #181B3A)";
            document.getElementById('sidebar').style.backgroundColor= "#181B3A";
            document.getElementById('sidebar').style.color= "#F5F5F5";
            document.getElementById('logo').style.filter = "none";
            document.getElementById('nightMode').style.color= "#F5F5F5";
            if (document.getElementById('form-container')){
                document.getElementById('form-container').style.backgroundColor= "#181B3A"
                document.getElementById('submitBTN').backgroundImage = "linear-gradient(to top, #181B3A, #181B3A)";
            }
            if (document.getElementById('chart1')){
                document.getElementById('chart1').style.backgroundColor = "#181B3A";
                document.getElementById('chart2').style.backgroundColor = "#181B3A";
                document.getElementById('reports').style.backgroundColor = "#181B3A";
            }

        }

        !clicked ? light() : dark()
        setClicked(prevState => !prevState)

    }

    return (
        <nav id="navbar" style={{ paddingLeft: '10px', height: '9vh', display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ paddingLeft: '18px', textAlign: 'left', display: 'flex', alignItems: 'center' }}>
                <img onClick={() => navigate("/main")}  id="logo" src={logo} className={!clicked?"logoDark":"logoLight"}  alt="logo"/>
            </div>
            <div className="block2" style={{ display: 'flex', alignItems: 'center', paddingRight: '30px' }}>
                <h2 id="nightMode" className={!clicked?"nightModeDark":"nightModeLight"} style={{ fontSize: '15px' }}>Night Mode</h2>
                <Switch  checked={!clicked} onChange={toggleDarkMode} />
                <div className="profile-avatar"  onClick={() => navigate("/setting")} style={style}></div>
            </div>
        </nav>


    )
}

export default TopBar;