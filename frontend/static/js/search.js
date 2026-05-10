// ===============================
// STOCK SEARCH SYSTEM
// ===============================

const STOCK_LIST = [

"RELIANCE.NS",
"TCS.NS",
"INFY.NS",
"HDFCBANK.NS",
"ICICIBANK.NS",
"SBIN.NS",
"ITC.NS",
"LT.NS",
"AXISBANK.NS",
"ASIANPAINT.NS",
"MARUTI.NS",
"TITAN.NS",
"ULTRACEMCO.NS",
"BAJFINANCE.NS",
"WIPRO.NS"

];

const searchBox = document.getElementById("searchBox");

const results = document.getElementById("results");

if(searchBox){

searchBox.addEventListener("input",function(){

const query = this.value.toUpperCase();

results.innerHTML="";

const filtered = STOCK_LIST.filter(stock =>

stock.includes(query)

);

filtered.slice(0,10).forEach(stock =>{

const li = document.createElement("li");

li.innerHTML = `<a href="/stock/${stock}">${stock}</a>`;

results.appendChild(li);

});

});

}


