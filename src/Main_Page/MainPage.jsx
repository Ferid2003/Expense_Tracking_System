import "./MainPage.css";
import SideBar from "./test1.jsx";
import TopBar from "./topbar.jsx";
import CorePage from "./CorePage.jsx";



function Chat() {



    return (

        <div className="mainContainer">
            < TopBar />
            <div className="nonNavContainer">
                <div className="SidebarContainer">
                    < SideBar />
                </div>
                <CorePage />
            </div>
        </div>


    )
}




export default Chat;