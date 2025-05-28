from flask import Flask, render_template, request, jsonify
import os
from tensorflow.keras.models import load_model
import pickle
from tensorflow.keras.preprocessing.sequence import pad_sequences
from pyvi import ViTokenizer
import numpy as np
app = Flask(__name__, static_folder=".", static_url_path="")

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/api/analyze', methods=['POST'])
def analyze():
    data = request.json
    text = data.get('text', '')
    if not text:
        return jsonify({"error": "Không có văn bản!"}), 400

    # Đây là kết quả của mô hình GRU 
    raw_predictions = gru_model_predict(text)

    # Chuyển đổi sang định dạng frontend mong muốn
    result = convert_to_api_format(raw_predictions)
    

    
    return jsonify(result)



def convert_to_api_format(predictions):
    tag_map = {
    "NOUN": "noun",
    "VERB": "verb",
    "ADJ": "adj",
    "ADV": "adv",
    "PRON": "pron",
    "ADP": "prep",
    "CCONJ": "conj",
    "NUM": "num",
    "PART": "part"
    }
    result = []
    for word, tag in predictions:
        tag_lower = tag_map.get(tag, "unk")  # Nếu không map được thì 'unk'
        result.append({"word": word, "type": tag_lower})
    return result

def gru_model_predict(text):
    # Load model và tokenizer đã lưu
    model = load_model("gru_pos_tagger.keras")
    with open("word_tokenizer.pkl", "rb") as f:
        word_tokenizer = pickle.load(f)
    with open("tag_tokenizer.pkl", "rb") as f:
        tag_tokenizer = pickle.load(f)

    # Tiền xử lý câu đầu vào
    tokens = text.split()  # hoặc dùng thư viện tách từ tốt hơn

    # Chuyển thành sequence số
    sequence = word_tokenizer.texts_to_sequences([tokens])
    MAXLEN = 1000
    sequence_pad = pad_sequences(sequence, maxlen=MAXLEN, padding='post')

    # Dự đoán
    pred = model.predict(sequence_pad)[0]

    # Giải mã nhãn
    idx2tag = {v: k for k, v in tag_tokenizer.word_index.items()}
    idx2tag[0] = 'PAD'  # padding
    pred_tags = [idx2tag[np.argmax(p)] for p in pred[:len(tokens)]]



    grouped = []
    if tokens:
        current_token = tokens[0]
        current_tag = pred_tags[0]

        for i in range(1, len(tokens)):
            if pred_tags[i] == current_tag:  # Nếu từ tiếp theo cùng loại
                current_token += "_" + tokens[i]  # Gộp lại thành cụm
            else:
                grouped.append((current_token, current_tag))  # Lưu cụm hiện tại
                current_token = tokens[i]  # Đặt lại cụm từ mới
                current_tag = pred_tags[i]  # Đặt lại nhãn mới
        grouped.append((current_token, current_tag))  # Đừng quên phần cuối cùng
    return grouped

if __name__ == '__main__':
    app.run(debug=True, port=5000)
