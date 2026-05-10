from flask import Flask, render_template, redirect, url_for, request
from flask import jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from flask_dance.contrib.google import make_google_blueprint, google
import os

# ================= APP CONFIG =================

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

app = Flask(
    __name__,
    template_folder='../frontend/templates',
    static_folder='../frontend/static'
)

app.config['SECRET_KEY'] = 'secret123'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(BASE_DIR, 'users.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Upload folder fix
UPLOAD_FOLDER = os.path.join(BASE_DIR, '../frontend/static/uploads')
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Ensure upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

db = SQLAlchemy(app)

login_manager = LoginManager(app)
login_manager.login_view = "login"

# ================= MODEL =================

class User(UserMixin, db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(200))

    profile_pic = db.Column(db.String(200), default="default.png")
    gender = db.Column(db.String(10))
    dob = db.Column(db.String(20))
    mobile = db.Column(db.String(15))

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# ================= GOOGLE LOGIN =================

google_bp = make_google_blueprint(
    client_id="YOUR_GOOGLE_CLIENT_ID",
    client_secret="YOUR_GOOGLE_SECRET",
    redirect_to="google_login"
)

app.register_blueprint(google_bp, url_prefix="/login")

@app.route("/google_login")
def google_login():

    if not google.authorized:
        return redirect(url_for("google.login"))

    resp = google.get("/oauth2/v2/userinfo")
    info = resp.json()

    email = info["email"]
    name = info.get("name", email.split("@")[0])

    user = User.query.filter_by(email=email).first()

    if not user:
        user = User(username=name, email=email, password="")
        db.session.add(user)
        db.session.commit()

    login_user(user)
    return redirect(url_for("home"))

# ================= ROUTES =================

# FORGOT PASSWORD
@app.route("/forgot-password", methods=["GET", "POST"])
def forgot_password():

    if request.method == "POST":
        email = request.form.get("email")

        user = User.query.filter_by(email=email).first()

        if not user:
            return "Email not found!"

        # 🔥 Demo reset password
        new_password = "123456"
        user.password = generate_password_hash(new_password)
        db.session.commit()

        return "Password reset successful! New password is 123456"

    return render_template("forgot_password.html")
# CONTACT PAGE (FIXED)
@app.route("/contact", methods=["GET", "POST"])
def contact():

    if request.method == "POST":
        name = request.form.get("name")
        email = request.form.get("email")
        subject = request.form.get("subject")
        message = request.form.get("message")

        print("===== CONTACT FORM =====")
        print("Name:", name)
        print("Email:", email)
        print("Subject:", subject)
        print("Message:", message)

        return "Form Submitted Successfully ✅"

    return render_template("contact.html")

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/stock")
def stock():
    return render_template("stock.html")

@app.route("/stocks")
def stocks():
    return render_template("stocks.html")

@app.route("/markets")
def markets():
    return render_template("markets.html")

@app.route("/contact")
def contact_page():
    return render_template("contact.html")

@app.route("/get-started")
def get_started():

    if current_user.is_authenticated:
        return redirect(url_for("home"))

    return redirect(url_for("login", next=request.url))

@app.route("/stock_api/<symbol>")
def stock_api(symbol):
    return jsonify({
        "price": 100,
        "change": 1.5,
        "history": [100,102,101,105],
        "market_cap": "1T"
    })
@app.route("/nifty50")
def nifty50():
    import yfinance as yf

    symbols = [
        "RELIANCE.NS",
        "TCS.NS",
        "INFY.NS",
        "HDFCBANK.NS",
        "ICICIBANK.NS",
        "SBIN.NS"
    ]

    data_list = []

    for sym in symbols:
        try:
            stock = yf.Ticker(sym)
            data = stock.history(period="1d")

            if data.empty:
                continue

            price = round(data["Close"].iloc[-1], 2)
            open_price = round(data["Open"].iloc[-1], 2)
            change = round(price - open_price, 2)

            data_list.append({
                "symbol": sym,
                "price": price,
                "change": change
            })

        except Exception as e:
            print("Error:", e)

    return jsonify(data_list)

# REGISTER
@app.route("/register", methods=["GET", "POST"])
def register():

    if request.method == "POST":

        username = request.form["username"]
        email = request.form["email"]
        password = request.form["password"]

        # check existing user
        if User.query.filter_by(email=email).first():
            return "Email already exists!"

        hashed_pw = generate_password_hash(password)

        user = User(
            username=username,
            email=email,
            password=hashed_pw
        )

        db.session.add(user)
        db.session.commit()

        return redirect(url_for("login"))

    return render_template("register.html")

# LOGIN
@app.route("/login", methods=["GET", "POST"])
def login():

    if request.method == "POST":

        email = request.form["email"]
        password = request.form["password"]

        user = User.query.filter_by(email=email).first()

        # 🔥 if user not found → register page
        if not user:
            return redirect(url_for("register"))

        # check password
        if user.password and not check_password_hash(user.password, password):
            return "Wrong password!"

        login_user(user)
        return redirect(url_for("home"))

    return render_template("login.html")

# LOGOUT
@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("login"))

# PROFILE
@app.route("/profile", methods=["GET", "POST"])
@login_required
def profile():

    if request.method == "POST":

        current_user.username = request.form["username"]
        current_user.gender = request.form["gender"]
        current_user.dob = request.form["dob"]
        current_user.mobile = request.form["mobile"]

        file = request.files.get("photo")

        if file and file.filename != "":
            filepath = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
            file.save(filepath)
            current_user.profile_pic = file.filename

        db.session.commit()
        return redirect(url_for("profile"))

    return render_template("profile.html", user=current_user)

# ================= RUN =================

if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)