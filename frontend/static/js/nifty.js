// ===============================
// NIFTY STOCK LIST AUTO LOAD
// ===============================

async function loadNifty(){

try{

const res = await fetch("/nifty50");

const data = await res.json();

const table = document.getElementById("nifty-table");

if(!table) return;

table.innerHTML="";

data.forEach(stock=>{

const row = `

<tr>

<td>

<a href="/stock/${stock.symbol}">

${stock.symbol}

</a>

</td>

<td>₹${stock.price}</td>

<td style="color:${stock.change>=0?'green':'red'}">

${stock.change}

</td>

</tr>

`;

table.innerHTML += row;

});

}
catch(error){

console.log("Nifty load error",error);

}

}

loadNifty();

setInterval(loadNifty,10000);