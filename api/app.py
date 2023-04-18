from flask import Flask
from flask_cors import CORS
from views import api_routes

app = Flask(__name__)
CORS(app)
app.register_blueprint(api_routes, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True)
