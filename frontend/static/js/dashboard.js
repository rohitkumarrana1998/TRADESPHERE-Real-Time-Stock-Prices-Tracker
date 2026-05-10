// ===============================
// LIVE DASHBOARD STOCK UPDATE
// ===============================

const dashboardStocks = [
    "RELIANCE.NS",
    "TCS.NS",
    "INFY.NS",
    "HDFCBANK.NS",
    "ICICIBANK.NS"
];

async function updateStock(symbol){

    try{

        const response = await fetch(`/stock_api/${symbol}`);

        const data = await response.json();

        const priceEl = document.getElementById(`price-${symbol}`);
        const changeEl = document.getElementById(`change-${symbol}`);

        if(!priceEl || !changeEl) return;

        priceEl.innerText = "₹" + data.price;

        changeEl.innerText = data.change;

        changeEl.style.color = data.change >= 0 ? "green" : "red";

    }
    catch(error){

        console.log("Stock error:", error);

    }

}

function refreshDashboard(){

    dashboardStocks.forEach(stock => {

        updateStock(stock);

    });

}

refreshDashboard();

setInterval(refreshDashboard,5000);