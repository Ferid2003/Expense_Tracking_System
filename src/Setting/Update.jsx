import {useAuth} from "../Authentication/AuthContext.jsx";
import {doc, setDoc} from "firebase/firestore";
import {db} from "../Firebase.js";
import {useEffect, useState} from "react";
import {storage} from "../Firebase.js"
import {ref,uploadBytesResumable,getDownloadURL } from "firebase/storage"
import {Avatar} from "@mui/material";







function Setting(){


    const {us} = useAuth()



    const [username,setUsername] = useState(null)
    const [updated,setUpdated] = useState(false)
    const [percents,setPercent] = useState()
    const [pic,setPic] = useState(null)

    const [file, setFile] = useState(null);

    function handleChange(event) {
        setFile(event.target.files[0]);
    }


    useEffect(() => {
        if (file) {
            const objectURL = URL.createObjectURL(file);
            setPic(objectURL);
        }
    },[file])





     async function checkUpdate(e){
        e.preventDefault()
         const docRef = doc(db, "users", us.id)
         if (file!==null){
             const storageRef =  ref(storage, `/files/${file.name}`)
             const uploadTask = uploadBytesResumable(storageRef, file);
             uploadTask.on(
                 "state_changed",
                 (snapshot) => {
                     const percent = Math.round(
                         (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                     );

                     // update progress
                     setPercent(percent);
                 },
                 (err) => console.log(err),
                 async () => {
                     // download url
                     const ur = await getDownloadURL(uploadTask.snapshot.ref)
                     await setDoc(
                         docRef,
                         {username: username ? username : us.data().username, profile_pic: file ? ur : us.data().profile_pic},
                         { merge: true }
                     )

                 }
             );
             await uploadTask
             setFile(null)
         }
         document.getElementById("username").value = null
         setUpdated(true)
    }




    return(
        <>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"90vh",width:"85vw"}}>
                    <h1 className="title">Update Profile</h1>
                    {updated && <h1>Changes are saved!</h1>}
                    <form className="login-form">
                        <input onChange={e => setUsername(e.target.value)} id="username" name="username" type="text" className="username" placeholder="Username"/>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"50px"}}>
                            {pic ? <div className="profile-avatar" style={{backgroundImage: "url(" + pic + ")",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                borderRadius: "48px",
                                height: "180px",
                                width: "80px",
                                marginRight: "41px"}}></div> : <Avatar
                                alt="profile_pic"
                                src={pic}
                                sx={{ width: '6vw', height: '9vh' }}
                            />}
                            <div className="input-div">
                                <input type="file" onChange={handleChange}  className="file" multiple="multiple" accept="image/*"/>
                                <p>{percents} "% done"</p>
                            </div>
                        </div>
                        <a onClick={checkUpdate}  className="loginLight login">Save changes</a>
                    </form>
                </div>
        </>



    )
}


export default Setting;