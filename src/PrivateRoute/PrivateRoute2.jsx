import {useAuth} from "../Authentication/AuthContext.jsx";
import {Navigate} from "react-router-dom";

function PrivateRoute2({children}){

    const {user} = useAuth()

    return user ? children : <Navigate to="/login" />
}

export default PrivateRoute2;