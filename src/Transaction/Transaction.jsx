import {useEffect, useState} from "react";
import {addDoc, onSnapshot} from "firebase/firestore";
import {useAuth} from "../Authentication/AuthContext.jsx";




function Transaction() {


    const {transaction} = useAuth()

    const [input, setInput] = useState("")
    const [amountInput, setAmountInput] = useState("")
    const [textareaInput, setTextareaInput] = useState("")
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

    }, []);










    async function handleClick(event) {
        event.preventDefault()
        var radioButtons = document.getElementsByName('type');
        var selectedValue;
        radioButtons.forEach(function(radioButton) {
            if (radioButton.checked) {
                selectedValue = radioButton.value;
            }
        });
        if (input !== null && input !== "") {
            if (amountInput !== null){
                const transactionObj = {
                    category: document.getElementById("category").value,
                    currency: document.getElementById("currency").value,
                    description: textareaInput,
                    income: selectedValue !== "expense",
                    amount: amountInput,
                    title: input,
                    date:Date.now()
                }
                setAmountInput(null)
                setInput(null)
                setTextareaInput(null)
                document.getElementById('title').value=null
                document.getElementById('amount').value=null
                document.getElementById('description').value=null
                await addDoc(transaction, transactionObj)
            }else {
                window.alert("Enter Amount number")
            }
        }else {
            window.alert("Enter Title")
        }
    }

    function handleInputChange() {
        setInput(document.getElementById('title').value)
    }

    function handleAmountInputChange() {
        setAmountInput(document.getElementById('amount').value)
    }

    function handleTextAreaInputChange() {
        setTextareaInput(document.getElementById('description').value)
    }





    return (

        <div className="transactionForum">
            <div id="form-container" className={!clicked?"form-container":"form-containerLight"}>
                <h2>Add New Expense/Income</h2>
                <form>
                    <label htmlFor="title">Title</label>
                    <input type="text" id="title" name="title" onChange={handleInputChange}></input>
                    <label htmlFor="amount">Amount</label>
                    <input type="text" id="amount" name="amount" onChange={handleAmountInputChange}></input>
                        <label htmlFor="currency">Currency</label>
                        <select id="currency" name="currency">
                            <option value="USD">$</option>
                            <option value="EUR">€</option>
                            <option value="GBP">£</option>
                            <option value="AZN">₼</option>
                        </select>

                        <label htmlFor="category">Category</label>
                        <select id="category" name="category">
                            <option value="transport">Transport</option>
                            <option value="food">Food</option>
                            <option value="utilities">Utilities</option>
                            <option value="healthcare">Healthcare</option>
                            <option value="entertainment">Entertainment</option>
                            <option value="shopping">Shopping</option>
                            <option value="education">Education</option>
                            <option value="travel">Travel</option>
                            <option value="other">other</option>
                        </select>


                        <div className="radio-buttons">
                            <input type="radio" id="expense" name="type" value="expense" checked></input>
                                <label htmlFor="expense">Expense</label>
                            <input type="radio" id="income" name="type" value="income"></input>
                                    <label htmlFor="income">Income</label>
                        </div>

                        <label htmlFor="description">Description</label>
                        <textarea onChange={handleTextAreaInputChange} id="description" name="description"></textarea>

                        <button id="submitBTN" onClick={handleClick} className={!clicked?"buttonDark":"buttonLight"} type="submit">Submit</button>
                </form>
            </div>
        </div>

    )
}




export default Transaction;