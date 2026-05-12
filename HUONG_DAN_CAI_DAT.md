# Hướng dẫn đóng gói Folder Guard Pro thành file .exe (Windows 10 - 64bit)

Chào bạn! Rất tiếc vì lỗi bạn gặp phải. Tôi đã cập nhật tệp tin `main.js` còn thiếu để ứng dụng có thể khởi chạy chính xác sau khi cài đặt.

## Bước 1: Cách tải mã nguồn (Export to ZIP)
Nếu bạn không thấy nút Export, bạn hãy làm như sau:
1. Nhìn vào menu **Settings** (biểu tượng bánh răng) hoặc biểu tượng **Ba dấu chấm** ở góc trên cùng bên phải.
2. Chọn **Export to ZIP**. Tệp này chứa toàn bộ mã nguồn đã sửa lỗi.

## Bước 2: Chuẩn bị trên máy tính
1. Giải nén tệp ZIP.
2. Cài đặt **Node.js** từ [nodejs.org](https://nodejs.org/).

## Bước 3: Đóng gói (Sửa lỗi "Privilege" & "Shortcut")
Để phần mềm có thể can thiệp hệ thống và tạo icon Desktop, bạn **CẦN**:
1. Chuột phải vào PowerShell/CMD, chọn **Run as Administrator**.
2. Chạy lệnh:
```bash
npm install
npm run build:win
```

## Bước 4: Kiểm tra Icon Desktop
Sau khi cài đặt xong bản mới này:
- Một biểu tượng **Folder Guard Pro** sẽ tự động xuất hiện trên màn hình **Desktop** của bạn.
- Khi sử dụng, hãy chọn **"Run as Administrator"** cho phần mềm để nó có quyền thực thi lệnh `attrib` (ẩn/hiện) trên Windows.

## Lưu ý về chức năng:
- **Ẩn Folder:** Phần mềm sử dụng lệnh cấp cao của Windows (`+h +s`) để ẩn thư mục. Thư mục sẽ biến mất hoàn toàn ngay cả khi bạn bật "Show hidden files" (trừ khi bạn tắt cả "Hide protected operating system files").
- **Tác động thật:** Các thay đổi bây giờ sẽ tác động trực tiếp tới hệ thống tệp tin thông qua lớp giao tiếp `electronAPI`.

**Lưu ý quan trọng:** Tôi đã cấu hình lại đường dẫn tương đối (Relative Path) để sửa lỗi màn hình trắng bạn gặp phải. Bạn hãy tải lại bản ZIP mới nhất này để đóng gói nhé.

---
**Thông tin bổ sung:**
- Ứng dụng hiện đã có tệp điều hướng chính (`main.js`).
- Cấu hình trong `package.json` đã được tối ưu để bao gồm tất cả các thành phần cần thiết vào bản cài đặt.
