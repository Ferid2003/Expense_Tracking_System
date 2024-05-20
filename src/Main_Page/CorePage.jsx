import {useAuth} from "../Authentication/AuthContext.jsx";
import {useEffect, useState} from "react";
import {Document, Page, PDFDownloadLink, StyleSheet, Text, View} from '@react-pdf/renderer';
import {getDocs} from "firebase/firestore";
import {GoogleCharts} from 'google-charts';
import download from "../images/arrow-down.svg";
import currencyapi from '@everapi/currencyapi-js'


function CorePage() {

    const {transaction} = useAuth()
    const [clicked,setClicked] = useState(localStorage.getItem("mode") === 'false')
    const [amounts,setAmounts] = useState([])
    const [categories,setCategories] = useState([])
    const [currencies,setCurrencies] = useState([])
    const [descriptions,setDescriptions] = useState([])
    const [titles,setTitles] = useState([])
    const [incomes,setIncomes] = useState([])
    const [pdfTransactions,setPdfTransactions] = useState([]);
    const [categoryAmounts, setCategoryAmounts] = useState({});
    const [dailyStats, setDailyStats] = useState({});
    const[income,setIncome] = useState(0);
    const[expense,setExpense] = useState(0);
    const [totalBalance,setTotalBalance] = useState(0);
    const[fromCurrency,setFromCurrency] = useState('USD');
    const[toCurrency,setToCurrency] = useState('EUR');
    const [currencyRate,setCurrencyRate] = useState();
    const client = new currencyapi('cur_live_1zAMjjURRWhKBEY6LCMXRCbc9bcyPDopo2hNfI4I')


    function exchangeCurrency(amount,currency){
        if (amount==="" || amount===null){
            return 0;
        }
        var amount1 = parseFloat(amount);
        if (currency==="EUR"){
            return amount1;
        }else  if(currency==="AZN"){
            return amount1*0.54;
        }else if(currency==="USD"){
            return amount1*0.93;
        }else {
            return amount1*1.16;
        }
    }
    const handleFromCurrencyChange = (event) => {
        setFromCurrency(event.target.value);
    };
    const handleToCurrencyChange = (event) => {
        setToCurrency(event.target.value);
    };




    function drawChart() {
        const chartData = [['Chart thing', 'Chart amount']];
        for (var category in categoryAmounts) {
            chartData.push([category, categoryAmounts[category]]);
        }
        function getChartWidth1() {
            if(window.innerWidth >= 1000){
                return 500
            }else if(window.innerWidth < 1000 && window.innerWidth>=840){
                return 400;
            }else if (window.innerWidth<840 && window.innerWidth>=650){
                return 300;
            }else if (window.innerWidth<650 && window.innerWidth>=550){
                return 200;
            }else if (window.innerWidth<420){
                return 350;
            }else {
                return 450;
            }
        }
        function renderChart(){
            var options = {
                title: 'All expenses',
                titleTextStyle: { color: '#F5F5F5', fontSize: 24 },
                backgroundColor: 'transparent', // Set background color to transparent
                width: getChartWidth1(),
                height:'auto',
                hAxis: { title: 'Day', titleTextStyle: { color: '#F5F5F5' }, textStyle: { color: '#F5F5F5' } },
                vAxis: { minValue: 0, textStyle: {color: '#F5F5F5'} },
                legend: { textStyle: { color: '#F5F5F5' }, position: 'right', alignment: 'center' }
            };
            const data = GoogleCharts.api.visualization.arrayToDataTable(chartData);
            const pie_1_chart = new GoogleCharts.api.visualization.PieChart(document.getElementById('chart1'));
            pie_1_chart.draw(data,options);
        }
        renderChart();
        window.addEventListener('resize', renderChart);

    }

    function drawChart2() {
        const chartData = [['Day', 'Spending', 'Income']];
        const sortedDays = Object.keys(dailyStats).sort();
        sortedDays.forEach(day => {
            chartData.push([day, dailyStats[day].spending, dailyStats[day].income]);
        });
        function getChartWidth2() {
            if(window.innerWidth > 1190){
                return 600
            }else if(window.innerWidth <= 1000 && window.innerWidth>=840){
                return 400;
            }else if (window.innerWidth<840 && window.innerWidth>=650){
                return 300;
            }else if (window.innerWidth<650 && window.innerWidth>=550){
                return 240;
            }else if (window.innerWidth<420){
                return 320;
            }else {
                return 400;
            }
        }
        function renderChart(){
            var options = {
                title: 'Daily Spending and Income',
                hAxis: { title: 'Day', titleTextStyle: { color: '#F5F5F5' }, textStyle: { color: '#F5F5F5' } },
                vAxis: { minValue: 0, textStyle: {color: '#F5F5F5'} },
                backgroundColor: 'transparent', // Set background color to transparent
                width: getChartWidth2(), // Set chart width
                titleTextStyle: { color: '#F5F5F5', fontSize: 20 }, // Set text color for chart title
                legend: 'none'
            };

            const data = GoogleCharts.api.visualization.arrayToDataTable(chartData);
            const pie_1_chart = new google.visualization.AreaChart(document.getElementById('chart2'));
            pie_1_chart.draw(data,options);
        }
        renderChart();
        window.addEventListener('resize', renderChart);
    }


    const fetchData = async (curr1, curr2) => {
        try {
            return await client.latest({
                base_currency: curr1,
                currencies: curr2
            });
        } catch (error) {
            console.error('Error fetching data:', error);
            return null; // or handle the error as per your application's requirements
        }
    };


    const fetchDataAndStore = async () => {
        const response = await fetchData(fromCurrency, toCurrency);
        if (response) {
            // Store the response value in a constant here if needed
            const storedValue = response.data[toCurrency].value;
            setCurrencyRate(storedValue);
        } else {
            // Handle the case when response is null
        }
    };

// Call the function
    fetchDataAndStore();







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
        const getInfoFromCollection = async () => {
            try {
                const querySnapshot = await getDocs(transaction);
                const newTransactions = []; // Array to store new transactions

                querySnapshot.forEach((doc) => {
                    // Access data from each document
                    const data = doc.data();
                    const date = new Date(data.date);
                    const newTransaction = {
                        category: data.category,
                        amount: data.amount,
                        currency: data.currency,
                        description: data.description,
                        title: data.title,
                        income: data.income,
                        date: date.toLocaleString()
                    };

                    newTransactions.push(newTransaction);


                    
                    const category = newTransaction.category;

                    if(!newTransaction.income) {
                        if (category in categoryAmounts) {
                            categoryAmounts[category] += exchangeCurrency(newTransaction.amount, newTransaction.currency);
                        } else{
                            categoryAmounts[category] = exchangeCurrency(newTransaction.amount, newTransaction.currency);
                        }
                    }




                
                 
                    const day = newTransaction.date.split(',')[0]; // Extracting day from date
                    if (!(day in dailyStats)) {
                        dailyStats[day] = {spending: 0, income: 0};
                    }
                    if (newTransaction.income) {
                        dailyStats[day].income += exchangeCurrency(newTransaction.amount,newTransaction.currency);
                        setIncome(income => income+exchangeCurrency(newTransaction.amount,newTransaction.currency));
                        setTotalBalance(totalBalance =>totalBalance+exchangeCurrency(newTransaction.amount,newTransaction.currency));
                    } else {
                        dailyStats[day].spending += exchangeCurrency(newTransaction.amount,newTransaction.currency);
                        setExpense(expense =>expense+exchangeCurrency(newTransaction.amount,newTransaction.currency));
                        setTotalBalance(totalBalance=>totalBalance-exchangeCurrency(newTransaction.amount,newTransaction.currency));

                    }

                    // Update state with individual fields (if needed)
                    setCategories(data.category);
                    setAmounts(data.amount);
                    setCurrencies(data.currency);
                    setDescriptions(data.description);
                    setTitles(data.title);
                    setIncomes(data.income);
                });

                // Update state with array of transactions
                setPdfTransactions(newTransactions);
                GoogleCharts.load(drawChart);
                GoogleCharts.load(drawChart2);
                

            } catch (error) {
                console.error('Error getting documents: ', error);
                return [];
            }
        };
        getInfoFromCollection();



    }, []);


    const styles = StyleSheet.create({
        page: {
            flexDirection: 'row',
            backgroundColor: '#E4E4E4'
        },
        table: {
            display: 'table',
            width: '100%',
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: '#000'
        },
        row: {
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderColor: '#000'
        },
        cellTitle: {
            flex: 1,
            borderRightWidth: 1,
            borderColor: '#000',
            padding: 5,
            fontWeight: 'bold'
        },
        cellData: {
            flex: 2,
            padding: 5
        }
    });

    const currentDate = new Date();
    const todayDate = new Date(currentDate);
    const lastWeekDate = new Date(currentDate);
    const lastMonthDate = new Date(currentDate);
    todayDate.setDate(currentDate.getDate() -1);
    lastWeekDate.setDate(currentDate.getDate() - 7);
    lastMonthDate.setDate(currentDate.getDate() - 30);

    const lastDayTransactions = pdfTransactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= todayDate && transactionDate <= currentDate;
    });
    const lastWeekTransactions = pdfTransactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= lastWeekDate && transactionDate <= currentDate;
    });
    const lastMonthTransactions = pdfTransactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= lastMonthDate && transactionDate <= currentDate;
    });


    const MyDoc = () => (
        <Document>
            {generatePdf(lastDayTransactions)}
        </Document>
    );
    const MyDoc2 = () => (
        <Document>
            {generatePdf(lastWeekTransactions)}
        </Document>
    );
    const MyDoc3 = () => (
        <Document>
            {generatePdf(lastMonthTransactions)}
        </Document>
    );
    const MyDoc4 = () => (
        <Document>
            {generatePdf(pdfTransactions)}
        </Document>
    );



    function generatePdf(transactions){
        const pdfPages = transactions.length===0?
            <Page size="A4" style={styles.page}>
                <View style={styles.table}>
                    <View style={styles.row}>
                        <Text style={styles.cellTitle}>No Transactions</Text>
                    </View>
                </View>
            </Page> : transactions.map((transaction, index) => (
                <Page key={index} size="A4" style={styles.page}>
                    <View style={styles.table}>
                        <View style={styles.row}>
                            <Text style={styles.cellTitle}>Category:</Text>
                            <Text style={styles.cellData}>{transaction.category}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.cellTitle}>Amount:</Text>
                            <Text style={styles.cellData}>{transaction.amount}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.cellTitle}>Currency:</Text>
                            <Text style={styles.cellData}>{transaction.currency}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.cellTitle}>Description:</Text>
                            <Text style={styles.cellData}>{transaction.description}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.cellTitle}>Title:</Text>
                            <Text style={styles.cellData}>{transaction.title}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.cellTitle}>Income:</Text>
                            <Text style={styles.cellData}>{transaction.income?"true":"false"}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.cellTitle}>Date:</Text>
                            <Text style={styles.cellData}>{new Date(transaction.date).toLocaleString()}</Text>
                        </View>
                    </View>
                </Page>
            ));
            return pdfPages;
    }







    return (
        <div className="CoreContainer" >
            <div className="categories" >
                <div className="category1 report">
                    Total Balance
                    <h4 className="h4h">{`${totalBalance.toFixed(2)} EUR`}</h4>
                </div>
                <div className="category2 report">
                    Income
                    <h4 className="h4h">{`${income.toFixed(2)} EUR`}</h4>
                </div>
                <div className="category3 report">
                    Expenses
                    <h4 className="h4h">{`${expense.toFixed(2)} EUR`}</h4>
                </div>
                <div className="category4">
                    <div  style={{display:"flex",flexDirection:"row",height:"4vh",alignItems:"center",justifyContent:"left"}}>
                        <select className="selectBox" value={fromCurrency} onChange={handleFromCurrencyChange}  id="currency" name="currency">
                            <option value="USD">$</option>
                            <option value="EUR">€</option>
                            <option value="GBP">£</option>
                            <option value="AZN">₼</option>
                            <option value="JPY">¥</option>
                            <option value="KRW">₩</option>
                            <option value="KZT">лв</option>
                            <option value="TRY">₺</option>
                            <option value="RUB">₽</option>
                            <option value="NOK">kr</option>
                            <option value="PLN">zł</option>
                        </select>
                        <h3>To</h3>
                        <select className="selectBox"   value={toCurrency} onChange={handleToCurrencyChange} id="currency" name="currency">
                            <option value="USD">$</option>
                            <option value="EUR">€</option>
                            <option value="GBP">£</option>
                            <option value="AZN">₼</option>
                            <option value="JPY">¥</option>
                            <option value="KRW">₩</option>
                            <option value="KZT">лв</option>
                            <option value="TRY">₺</option>
                            <option value="RUB">₽</option>
                            <option value="NOK">kr</option>
                            <option value="PLN">zł</option>
                        </select>
                    </div>
                    <h2>{currencyRate}</h2>
                </div>
            </div>
            <div className="charts">
                <div id="chart1" className={!clicked?"chart1":"chart1Light"} >All Expenses</div>
                <div id="chart2" className={!clicked?"chart2":"chart2Light"}>Earning Flow</div>
            </div>
            <div id="reports" className={!clicked?"reportsDark":"reportsLight"}>
                <div className="report1 report" >
                    Daily Report
                    <PDFDownloadLink  document={<MyDoc />} fileName="dailyReport.pdf">
                        <img  id="download"  src={download} className={!clicked?"downloadDark":"downloadLight"}  alt="download"/>
                    </PDFDownloadLink>
                </div>
                <div className="report2 report">
                    Weekly Report
                    <PDFDownloadLink document={<MyDoc2 />} fileName="weeklyReport.pdf">
                        <img  id="download"  src={download} className={!clicked?"downloadDark":"downloadLight"}  alt="download"/>
                    </PDFDownloadLink>
                </div>
                <div className="report3 report">
                    Monthly Report
                    <PDFDownloadLink document={<MyDoc3 />} fileName="monthlyReport.pdf">
                        <img  id="download"  src={download} className={!clicked?"downloadDark":"downloadLight"}  alt="download"/>
                    </PDFDownloadLink>
                </div>
                <div className="report4 report">
                    Yearly Report
                    <PDFDownloadLink document={<MyDoc4 />} fileName="yearlyReport.pdf">
                        <img  id="download"  src={download} className={!clicked?"downloadDark":"downloadLight"}  alt="download"/>
                    </PDFDownloadLink>
                </div>
            </div>
        </div>

    )
}

export default CorePage;