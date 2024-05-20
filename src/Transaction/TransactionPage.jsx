import {useAuth} from "../Authentication/AuthContext.jsx";
import Transaction from "./Transaction.jsx";
import SideBar from "../Main_Page/test1.jsx";
import TopBar from "../Main_Page/topbar.jsx";




function TransactionPage() {



    return (

        < div className="TransactionPageContainer">
            < TopBar />
            <div className="TransactionContainer">
                < SideBar />
                <Transaction />
            </div>



        </div>


    )
}




export default TransactionPage;