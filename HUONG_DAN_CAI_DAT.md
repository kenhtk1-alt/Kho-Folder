# Hướng dẫn đóng gói Folder Guard Pro thành file .exe (Windows 10 - 64bit)

Chào bạn! Để biến ứng dụng này thành một phần mềm cài đặt chuyên nghiệp trên máy tính, bạn hãy thực hiện các bước sau trên máy tính của mình:

## Bước 1: Chuẩn bị môi trường
1. Tải toàn bộ mã nguồn này về máy tính (Sử dụng tính năng **Export to ZIP** trong menu của AI Studio).
2. Đảm bảo máy tính đã cài đặt **Node.js** (tải tại [nodejs.org](https://nodejs.org/)).

## Bước 2: Cài đặt thư viện
Mở Terminal (CMD hoặc PowerShell) tại thư mục chứa mã nguồn và chạy lệnh:
```bash
npm install
```

## Bước 3: Build ứng dụng Web
Chạy lệnh để tạo bản phân phối web:
```bash
npm run build
```

## Bước 4: Đóng gói thành file .exe
Ứng dụng sử dụng **Electron** để chạy trên Windows. Bạn hãy chạy lệnh sau:
```bash
npm run build:win
```
*(Lưu ý: Tôi đã thiết lập sẵn cấu hình Electron trong tệp package.json của bạn)*

## Kết quả
Sau khi lệnh chạy xong, bạn sẽ thấy thư mục `dist_electron` xuất hiện. Trong đó sẽ có file `Folder_Guard_Pro_Setup_x64.exe` để bạn cài đặt và sử dụng trên Windows 10!

---
**Thông tin phần mềm:**
- Hệ điều hành: Windows 10 / 11 (64-bit)
- Kiến trúc: x64
- Công nghệ: React + Vite + Electron
