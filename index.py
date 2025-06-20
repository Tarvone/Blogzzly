from flask import Flask, render_template, request, redirect, flash
from markupsafe import escape
import requests, os, html, logging
from datetime import datetime
from flask_mail import Mail, Message
from dotenv import load_dotenv
load_dotenv()
notionProxy = os.getenv("NOTION_PROXY_URL")

app = Flask(__name__, static_folder="static", template_folder="templates")
app.secret_key = os.getenv("SECRET_KEY")

# configuration of mail
app.config['MAIL_SERVER'] = os.getenv('EMAIL_HOST')
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = os.getenv('HOST_USER')
app.config['MAIL_PASSWORD'] = os.getenv('HOST_PASSWORD')
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
mail = Mail(app)

def send_mail(name, email, message):
    msg = Message(
        subject=f"Blogzzly contact form submission from {name} <{email}>",
        sender=('Tarv from Tirva Softwares', os.getenv('HOST_USER')),
        recipients=[os.getenv('RECEIVER_MAIL')],
    )
    host_url = request.host_url
    msg.html = render_template("Email-Template.html", host_url=host_url, name=name, message=message)
    mail.send(msg)

@app.context_processor
def inject_year():
    return {'year': datetime.now().year}

def get_posts():
    response = requests.get(f'{notionProxy}/blogs')
    response.raise_for_status()
    return response.json()['data']

def get_single_post(slug):
    response = requests.get(f'{notionProxy}/blogs/{slug}')
    response.raise_for_status()

    raw_data = response.json()['data']
    escaped_html = raw_data['content']
    decoded_html = html.unescape(escaped_html)
    raw_data['content'] = decoded_html
    return raw_data

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/blog')
def blog():
    posts = get_posts()
    return render_template('Blog.html', Posts=posts)

@app.route('/blog/<string:slug>')
def post(slug):
    article = get_single_post(escape(slug))
    return render_template('Post.html', post=article)

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        message = request.form.get('message')

        if not name or not email or not message:
            flash("All fields are required.", "warning")
            return redirect('/contact')

        try:
            send_mail(name, email, message)
            return redirect('/success')
        except Exception:
            logging.exception("Failed to send email")
            flash("Failed to send message! Try again", "danger")
            return render_template('Contact.html', name=name, email=email, message=message)


    return render_template('Contact.html')

@app.route('/success')
def success():
    return render_template('Success.html')

if __name__ == '__main__' and os.getenv("APP_ENV") == "Development":
    app.run(debug=True)