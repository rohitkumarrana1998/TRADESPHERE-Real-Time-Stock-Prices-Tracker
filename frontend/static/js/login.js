// Enhanced login.js with Help Modal functionality
const toggleLink = document.getElementById('toggleLink');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const formTitle = document.getElementById('formTitle');
const formDesc = document.getElementById('formDesc');
const message = document.getElementById('message');
const helpLink = document.querySelector('.help-link');
const forgotLink = document.querySelector('.forgot-link');
let isLogin = true;

// Toggle Login/Signup
toggleLink.addEventListener('click', () => {
    isLogin = !isLogin;
    
    if (isLogin) {
        loginForm.style.display = "block";
        signupForm.style.display = "none";
        formTitle.innerText = "Log in to your account";
        formDesc.innerText = "Apne account me login kare";
        toggleLink.innerText = "New account? Sign Up";
    } else {
        loginForm.style.display = "none";
        signupForm.style.display = "block";
        formTitle.innerText = "Create your account";
        formDesc.innerText = "Naya account banaye";
        toggleLink.innerText = "Already have an account? Login";
    }
});

// Help Modal Function
function showHelpModal() {
    const modal = document.createElement('div');
    modal.className = 'help-modal';
    modal.innerHTML = `
        <div class="help-modal-content">
            <div class="help-header">
                <h3>Help & Support</h3>
                <span class="close-help" onclick="this.closest('.help-modal').remove()">&times;</span>
            </div>
            <div class="help-body">
                <p><strong>Login Issues?</strong></p>
                <ul>
                    <li>Check if Caps Lock is ON</li>
                    <li>Verify email/username spelling</li>
                    <li>Password is case-sensitive</li>
                </ul>
                <p><strong>Forgot Password?</strong></p>
                <p>Click "Forgot password?" → Enter email → Reset link sent</p>
                <p><strong>Need more help?</strong></p>
                <p>📧 support@stockify.in | 📱 1800-XXX-XXXX</p>
            </div>
            <div class="help-actions">
                <button onclick="this.closest('.help-modal').remove()" class="help-close-btn">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Auto-focus close button
    setTimeout(() => {
        modal.querySelector('.help-close-btn').focus();
    }, 100);
}

// Event Listeners
if (helpLink) helpLink.addEventListener('click', showHelpModal);
if (forgotLink) forgotLink.addEventListener('click', () => {
    alert('Password reset link will be sent to your email!');
});

// Password toggle (already in HTML inline)
function togglePassword(inputId, iconWrapper) {
    const input = document.getElementById(inputId);
    const icon = iconWrapper.querySelector('i');
    
    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = "password";
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Form handlers
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    message.textContent = 'Logging in...';
    message.className = 'success';
    
    // Flask form submission happens automatically via POST action
    setTimeout(() => {
        message.textContent = 'Login successful! Redirecting to dashboard...';
    }, 1000);
});

document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    message.textContent = 'Creating account...';
    message.className = 'success';
    
    setTimeout(() => {
        message.textContent = 'Account created! Redirecting...';
    }, 1000);
});

// Market data simulation
async function updateMarketData() {
    const nifty = document.querySelector('.nifty .change');
    const banknifty = document.querySelector('.banknifty .change');
    const sensex = document.querySelector('.sensex .change');
    
    // Simulate live updates
    const changes = ['+0.12%', '+0.45%', '-0.23%', '+1.2%', '-0.89%'];
    nifty.textContent = changes[Math.floor(Math.random() * changes.length)];
    banknifty.textContent = changes[Math.floor(Math.random() * changes.length)];
    sensex.textContent = changes[Math.floor(Math.random() * changes.length)];
}
setInterval(updateMarketData, 8000);