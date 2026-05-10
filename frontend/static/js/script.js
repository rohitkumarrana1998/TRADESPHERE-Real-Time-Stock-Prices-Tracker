/* =========================
   HERO SECTION (Single Stock)
   ========================= */

const priceElement = document.querySelector(".price");
const profitElement = document.querySelector(".profit");

// ❌ symbol undefined था → remove कर दिया
// const priceEl = document.getElementById(`price-${symbol}`);

let heroSymbol = "NIFTY"; // default hero stock

async function updateHeroPrice() {
    try {
        // 🔥 SAFE CHECK (crash रोकने के लिए)
        if (!priceElement || !profitElement) return;

        const response = await fetch(`/api/stock?symbol=${heroSymbol}`);
        const data = await response.json();

        if (!data || data.price === null) {
            priceElement.innerText = "N/A";
            profitElement.innerText = "";
            return;
        }

        priceElement.innerText = `₹${data.price}`;
        profitElement.innerText = `${data.change}%`;
        profitElement.style.color = data.change >= 0 ? "green" : "red";

    } catch (error) {
        console.error("Hero stock error:", error);
    }
}

/* =========================
   NAVBAR ACTIVE CLICK EFFECT
   ========================= */

const navLinks = document.querySelectorAll(".navbar a");

navLinks.forEach(link => {
    link.addEventListener("click", function () {
        navLinks.forEach(l => l.classList.remove("active"));
        this.classList.add("active");
    });
});

/* =========================
   AUTO REFRESH (API SAFE)
   ========================= */

// ❗ refreshDashboard अगर exist नहीं है तो crash ना हो
if (typeof refreshDashboard === "function") {
    setInterval(refreshDashboard, 5000);
    refreshDashboard();
}

// Hero stock auto update
setInterval(updateHeroPrice, 5000);
updateHeroPrice();

/* =========================
   PROFILE DROPDOWN
   ========================= */

document.addEventListener("DOMContentLoaded", function () {

    const btn = document.getElementById("profileBtn");
    const menu = document.getElementById("dropdownMenu");

    if (btn && menu) {
        btn.addEventListener("click", function (e) {
            e.stopPropagation();
            menu.style.display =
                (menu.style.display === "block") ? "none" : "block";
        });

        document.addEventListener("click", function () {
            menu.style.display = "none";
        });
    }

});

/* =========================
   BUTTON ROUTE
   ========================= */

function gostock() {
    window.location.href = "/stock";
}