from typing import Tuple
from flask import Flask
from flask_restplus import Api, Resource
from flask_cors import CORS
from flask_mail import Mail, Message


app = Flask(__name__, static_folder='send_files')
api = Api(app)
CORS(app, supports_credentials=True)
app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'old.onmyoji@gmail.com'
app.config['MAIL_PASSWORD'] = 'psFor9323'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True

mail = Mail(app)

# if __name__ == '__main__':
#     app.run(debug=True)