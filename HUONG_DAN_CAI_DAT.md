# Hướng dẫn đóng gói Folder Guard Pro thành file .exe (Windows 10 - 64bit)

Chào bạn! Rất tiếc vì lỗi bạn gặp phải. Tôi đã cập nhật tệp tin `main.js` còn thiếu để ứng dụng có thể khởi chạy chính xác sau khi cài đặt.

## Bước 1: Cách tải mã nguồn (Export to ZIP)
Nếu bạn không thấy nút Export, bạn hãy làm như sau:
1. Nhìn vào menu **Settings** (biểu tượng bánh răng) ở phía trên bên phải giao diện AI Studio.
2. Chọn **Export to ZIP**. Tệp này sẽ chứa toàn bộ mã nguồn bao gồm cả cấu hình đóng gói mới nhất.

## Bước 2: Chuẩn bị trên máy tính của bạn
1. Giải nén tệp ZIP đã tải.
2. Đảm bảo máy tính đã cài đặt **Node.js** (tải tại [nodejs.org](https://nodejs.org/)).

## Bước 3: Cài đặt và Đóng gói
Mở Terminal (CMD hoặc PowerShell) tại thư mục đã giải nén và chạy các lệnh sau:

```bash
# 1. Cài đặt các thư viện cần thiết
npm install

# 2. Tạo bản Build và đóng gói thành file .exe duy nhất
npm run build:win
```

## Bước 4: Kiểm tra kết quả
Sau khi lệnh chạy xong, bạn vào thư mục **`dist_electron`**. Bạn sẽ thấy file thực thi mới là:
**`Folder Guard Pro Setup 1.0.0.exe`**

Hãy chạy file này để cài đặt lại. Lỗi "Cannot find module index.js" đã được khắc phục triệt để bằng tệp `main.js` mà tôi vừa bổ sung.

---
**Thông tin bổ sung:**
- Ứng dụng hiện đã có tệp điều hướng chính (`main.js`).
- Cấu hình trong `package.json` đã được tối ưu để bao gồm tất cả các thành phần cần thiết vào bản cài đặt.
