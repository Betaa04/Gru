# 🧠 GRU Vocabulary Classifier Demo

Đây là một demo mô hình **GRU (Gated Recurrent Unit)** dùng để **phân loại từ vựng trong đoạn văn bản**. Ứng dụng có giao diện đơn giản, nơi bạn có thể nhập một đoạn văn và xem mô hình phân loại từ vựng theo các nhãn (labels) được huấn luyện.

---

## 🚀 Tính năng

- ✅ Nhập đoạn văn bản tùy ý
- ✅ Tiền xử lý văn bản (tokenization, padding, v.v.)
- ✅ Dự đoán từ mô hình GRU đã huấn luyện
- ✅ Trả về nhãn phân loại từ vựng

---

## 🖼️ Giao diện người dùng

- Giao diện web đơn giản (Flask hoặc Streamlit)
- Vùng nhập văn bản
- Nút "Phân loại"
- Kết quả hiển thị nhãn đầu ra

---

## 🧪 Mô hình

- Mô hình được xây dựng bằng **Keras/TensorFlow**
- Cấu trúc: Embedding → GRU → Dense → Softmax
- Đã được huấn luyện trên tập dữ liệu từ vựng có phân loại

---

## 🧰 Cài đặt

### 1. Clone repo

```bash
git clone https://github.com/Betaa04/Gru.git
cd Gru
