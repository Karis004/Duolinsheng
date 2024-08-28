import review
from flask import Flask, render_template, request, jsonify, make_response
from gevent.pywsgi import WSGIServer
import logging


app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_start', methods=['POST'])
def get_start():
    data = request.get_json()
    file_name = data.get('file_name', 'reocrd-Karis.xlsx')
    learn_words = data.get('learn_words', 5)
    my_list, days = review.review(file_name, learn_words)
    return jsonify(my_list=my_list, days=days)

@app.route('/get_review', methods=['POST'])
def get_review():
    data = request.get_json()
    file_name = data.get('file_name', 'Karis')
    res, days = review.get_review(file_name)
    return jsonify(res=res, days=days)

@app.route('/report_mistake', methods=['POST'])
def report_mistake():
    data = request.get_json()
    mistake_list = data.get('mistake_list', [])
    file_name = data.get('file_name', 'Karis')
    mistake_list = [x for i, x in enumerate(mistake_list) if x not in mistake_list[:i]]
    review.report_mistake(mistake_list, file_name)
    return make_response("", 204)

@app.route('/error_book', methods=['POST'])
def error_book():
    data = request.get_json()
    file_name = data.get('file_name', 'Karis')
    res, error_num_list = review.error_book(file_name)
    return jsonify(res=res, error_num_list=error_num_list)
        
if __name__ == '__main__':
    # app.run(debug=True, port=80, threaded=True, host='0.0.0.0')
    http_server = WSGIServer(
        ('0.0.0.0', 80), app,
    )
    http_server.serve_forever()