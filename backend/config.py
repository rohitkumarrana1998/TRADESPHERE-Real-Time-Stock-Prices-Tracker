import os

# Base directory
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:

    # 🔐 Secret Key
    SECRET_KEY = os.environ.get("SECRET_KEY") or "supersecretkey"

    # 🗄️ Database
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(BASE_DIR, 'users.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # 📂 Upload Folder
    UPLOAD_FOLDER = os.path.join(BASE_DIR, '../frontend/static/uploads')

    # 📁 Max file size (optional)
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024   # 16MB