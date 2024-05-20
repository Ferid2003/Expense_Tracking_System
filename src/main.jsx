import ReactDOM from 'react-dom/client'
import './index.css'
import {
    createBrowserRouter,
    RouterProvider,Navigate
} from "react-router-dom";
import Login from "./Login/Login.jsx";
import Register2 from "./Register/Register2.jsx";
import Register3 from "./Register/Register3.jsx";
import {AuthProvider} from "./Authentication/AuthContext.jsx";
import PrivateRoute2 from "./PrivateRoute/PrivateRoute2.jsx";
import ResetPassword from "./Reset_Password/Reset_Password.jsx";
import MainPage from "./Main_Page/MainPage.jsx";
import TransactionPage from "./Transaction/TransactionPage.jsx";
import Setting_Page from "./Setting/Setting_Page.jsx";



const router = createBrowserRouter(    [
    {
        path: "/login",
        element: <Login/>,
    },
    {
        path:"/register",
        element: <Register2 />,
    },
    {
        path:"/name",
        element: <PrivateRoute2> <Register3 /> </PrivateRoute2>,
    },
    {
        path:"//reset-password",
        element: <ResetPassword />,
    },
    {
        path: "/main",
        element: <PrivateRoute2> <MainPage /> </PrivateRoute2>,
    },
    {
        path: "/transaction",
        element: <PrivateRoute2> <TransactionPage /> </PrivateRoute2>,
    },
    {
        index:true,
        element: <Navigate to="/login"/>
    },
    {
        path:"/setting",
        element: <PrivateRoute2> <Setting_Page /> </PrivateRoute2>
    }
]);


ReactDOM.createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <RouterProvider router={router} />
    </AuthProvider>
)

