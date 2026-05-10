// =========================
// 📦 STOCK LIST
// =========================
const STOCK_LIST = [
    "RELIANCE.NS","TCS.NS","INFY.NS","HDFCBANK.NS","ICICIBANK.NS",
    "SBIN.NS","ITC.NS","LT.NS","AXISBANK.NS","ASIANPAINT.NS",
    "MARUTI.NS","TITAN.NS","ULTRACEMCO.NS","BAJFINANCE.NS","WIPRO.NS"
];


// =========================
// 🚀 SAFE LOAD STOCKS
// =========================
async function loadStocks() {

    const table = document.getElementById("stockTable");
    if (!table) return;

    table.innerHTML = "<tr><td colspan='5'>Loading...</td></tr>";

    try {

        const promises = STOCK_LIST.map(async (symbol) => {
            try {
                const res = await fetch(`/stock_api/${symbol}`);
                if (!res.ok) throw new Error("API error");

                const data = await res.json();

                return {
                    symbol,
                    price: data.price || "N/A",
                    change: data.change || 0,
                    history: data.history || [],
                    market_cap: data.market_cap || "N/A"
                };

            } catch (err) {
                console.error("Error for", symbol);

                return {
                    symbol,
                    price: "N/A",
                    change: 0,
                    history: [],
                    market_cap: "N/A"
                };
            }
        });

        const results = await Promise.all(promises);

        table.innerHTML = "";

        results.forEach((stock) => {

            const row = document.createElement("tr");

            row.innerHTML = `
<td>
<b>${stock.symbol.replace(".NS","")}</b><br>
${stock.symbol}
</td>

<td>
<canvas id="chart-${stock.symbol}"></canvas>
</td>

<td class="${stock.change >= 0 ? 'price-up' : 'price-down'}">
${stock.price !== "N/A" ? "₹" + stock.price : "N/A"}
</td>

<td>${stock.market_cap}</td>

<td>
<a href="/stock/${stock.symbol}" class="view-btn">View</a>
</td>
`;

            table.appendChild(row);

            // chart only if data exists
            if (stock.history.length > 0) {
                drawChart(stock.symbol, stock.history);
            }

        });

    } catch (err) {
        console.error("FULL ERROR:", err);
        table.innerHTML = "<tr><td colspan='5'>Server Error</td></tr>";
    }
}


// =========================
// 📊 CHART SAFE
// =========================
function drawChart(symbol, data) {

    const canvas = document.getElementById(`chart-${symbol}`);
    if (!canvas || !data || data.length === 0) return;

    new Chart(canvas, {
        type: "line",
        data: {
            labels: data.map((_, i) => i),
            datasets: [{
                data: data,
                borderColor: "green",
                pointRadius: 0,
                borderWidth: 2
            }]
        },
        options: {
            plugins: { legend: false },
            scales: {
                x: { display: false },
                y: { display: false }
            }
        }
    });
}


// =========================
// 📊 NIFTY SAFE
// =========================
async function loadNifty() {

    const table = document.getElementById("nifty-table");
    if (!table) return;

    try {

        const res = await fetch("/nifty50");
        const data = await res.json();

        table.innerHTML = "";

        data.forEach(stock => {

            const row = `
<tr>
<td><a href="/stock/${stock.symbol}">${stock.symbol}</a></td>
<td>₹${stock.price || "N/A"}</td>
<td style="color:${stock.change >= 0 ? 'green' : 'red'}">
${stock.change || 0}
</td>
</tr>
`;

            table.innerHTML += row;

        });

    } catch (err) {
        console.error("NIFTY ERROR:", err);
        table.innerHTML = "<tr><td colspan='3'>Error loading Nifty</td></tr>";
    }
}


// =========================
// 🔍 SEARCH FIX
// =========================
const searchBox = document.getElementById("searchBox");
const results = document.getElementById("results");

if (searchBox) {
    searchBox.addEventListener("input", function () {

        const query = this.value.toUpperCase();
        results.innerHTML = "";

        if (!query) return;

        const filtered = STOCK_LIST.filter(stock =>
            stock.includes(query)
        );

        filtered.slice(0, 10).forEach(stock => {

            const li = document.createElement("li");
            li.innerHTML = `<a href="/stock/${stock}">${stock}</a>`;
            results.appendChild(li);

        });
    });
}


// =========================
// ⚡ AUTO LOAD
// =========================
document.addEventListener("DOMContentLoaded", function () {

    loadStocks();
    loadNifty();

    setInterval(loadStocks, 30000);
    setInterval(loadNifty, 15000);

});

let currentStock = ""
let currentPrice = 0

function openTrade(symbol, price) {

    currentStock = symbol
    currentPrice = price

    document.getElementById("tradeModal").style.display = "flex"

    document.getElementById("tradeStock").innerText = symbol
    document.getElementById("tradePrice").innerText = "₹" + price
}

function closeTrade() {
    document.getElementById("tradeModal").style.display = "none"
}

function placeOrder(type) {

    const qty = document.getElementById("qty").value

    alert(`${type} Order Placed\nStock: ${currentStock}\nQty: ${qty}\nPrice: ₹${currentPrice}`)

    // 🔥 future backend API call yaha lagega
    // fetch("/place_order", {...})

    closeTrade()
}