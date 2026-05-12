# Hướng dẫn đóng gói Folder Guard Pro thành file .exe (Windows 10 - 64bit)

Chào bạn! Rất tiếc vì lỗi bạn gặp phải. Tôi đã cập nhật tệp tin `main.js` còn thiếu để ứng dụng có thể khởi chạy chính xác sau khi cài đặt.

## Bước 1: Cách tải mã nguồn (Export to ZIP)
Nếu bạn không thấy nút Export, bạn hãy làm như sau:
1. Nhìn vào menu **Settings** (biểu tượng bánh răng) hoặc biểu tượng **Ba dấu chấm** ở góc trên cùng bên phải.
2. Chọn **Export to ZIP**. Tệp này chứa toàn bộ mã nguồn đã sửa lỗi.

## Bước 2: Chuẩn bị trên máy tính
1. Giải nén tệp ZIP.
2. Cài đặt **Node.js** từ [nodejs.org](https://nodejs.org/).

## Bước 3: Đóng gói (Sửa lỗi "Privilege Error")
Để tránh lỗi "A required privilege is not held by the client" (như trong hình bạn gặp), bạn **BẮT BUỘC** phải làm một trong hai điều sau:
- **Lựa chọn A:** Mở CMD/PowerShell bằng quyền **Administrator**.
- **Lựa chọn B:** Bật **Developer Mode** trong Windows Settings.

Sau đó chạy lệnh:
```bash
npm install
npm run build:win
```

## Bước 4: Cài đặt phần mềm
Sau khi chạy xong, file cài đặt sẽ nằm tại:
`dist_electron\Folder Guard Pro Setup 1.0.0.exe`

**Lưu ý quan trọng:** Tôi đã cấu hình lại đường dẫn tương đối (Relative Path) để sửa lỗi màn hình trắng bạn gặp phải. Bạn hãy tải lại bản ZIP mới nhất này để đóng gói nhé.

---
**Thông tin bổ sung:**
- Ứng dụng hiện đã có tệp điều hướng chính (`main.js`).
- Cấu hình trong `package.json` đã được tối ưu để bao gồm tất cả các thành phần cần thiết vào bản cài đặt.
