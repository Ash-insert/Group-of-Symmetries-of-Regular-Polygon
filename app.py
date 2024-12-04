from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html")

@app.route("/visualization")
def visualization():
    return render_template('visualizing_symmetry_group.html')

if __name__ == '__main__':
    app.run(debug=True)
