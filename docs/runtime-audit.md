# Kiểm tra frontend/backend trước demo

Cập nhật ngày 08/10/2026. Phạm vi: Gateway và bốn service Identity, Organization-Customer, Inventory, Rental; AI chạy riêng, không cần bật để dùng các chức năng nghiệp vụ.

## Đã sửa

| Nhóm | Kết quả |
| --- | --- |
| Sales | Danh sách/chi tiết khách hàng, yêu cầu thuê, báo giá, đơn thuê và hợp đồng dùng API thật với ID thật. Tạo báo giá, gửi duyệt, ghi nhận khách chấp nhận, chuyển thành đơn và tạo hợp đồng không còn báo thành công bằng mock. |
| Operations | Đọc/tạo/sửa thiết bị, đổi trạng thái; tạo/sửa/bật-tắt kho; lập và xác nhận nhập/xuất kho; duyệt/xuất/nhận chuyển kho; bắt đầu, ghi kết quả và hoàn tất kiểm kê đều gọi Inventory. Kết quả sai vị trí có ô chọn kho thực tế. |
| Manager | Cấp quyền hủy đơn và lập gia hạn theo chi nhánh. Tách giữ chỗ và xác nhận giữ chỗ. Gia hạn thực hiện trên hợp đồng qua phụ lục duyệt/ký; cập nhật cả hợp đồng, đơn và reservation Inventory. Không cho hủy riêng đơn có hợp đồng chưa xử lý hoặc ký phụ lục của hợp đồng đã hủy. |
| Admin | Form lưu tên, Gmail, điện thoại, role, trạng thái và scope được chọn; bỏ hardcode organization/branch 1. Sửa tài khoản giữ các chi nhánh đã gán nếu không đổi chi nhánh chính. Kiểm tra Gmail theo ràng buộc database cũ để tránh lỗi 500. |
| Inventory | Kiểm tra organization/chi nhánh ở tầng service cho query, chi tiết, thao tác ghi và các ID tham chiếu. Sửa matcher `equipment-types` và quyền accessory. Availability loại thiết bị có giữ chỗ trùng thời gian; tạo/gia hạn reservation khóa các thiết bị theo thứ tự ID. |

Trang duyệt báo giá đã lấy ngày thuê từ yêu cầu thuê; bộ định dạng ngày xử lý giá trị rỗng/sai. Error boundary hiển thị thông báo và nút tải lại thay vì trang trắng. Cache phạm vi Manager được xóa khi đổi tài khoản.

## Luồng demo

1. Operations tạo thiết bị/model đã có, nhập kho và xác nhận phiếu.
2. Sales tạo khách hàng/yêu cầu thuê, tạo báo giá và gửi duyệt.
3. Manager duyệt báo giá.
4. Sales ghi nhận khách đã chấp nhận báo giá, chuyển thành đơn.
5. Manager giữ chỗ rồi **xác nhận giữ chỗ**.
6. Sales tạo hợp đồng từ đơn đã xác nhận; Manager duyệt.
7. Sales ghi nhận khách đã ký hợp đồng.
8. Manager lập và duyệt phụ lục gia hạn; Sales ghi nhận phụ lục đã ký.

Checkbox ghi nhận khách chấp nhận/ký là xác nhận nghiệp vụ của nhân viên, **không phải chữ ký số** hay OTP của khách hàng. Gia hạn chỉ có hiệu lực khi phụ lục được ký.

Sau cập nhật quyền, tài khoản Manager cần đăng xuất và đăng nhập lại. Hủy đơn có hợp đồng cần xử lý hợp đồng trước qua người có quyền `rental.contract.cancel`; không cấp thêm quyền này cho Manager trong lần sửa này.

## Dữ liệu và kiểm thử

Giữ nguyên tên database và dữ liệu cũ. Chỉ sửa đúng hai giá trị seed lỗi: `DEMO-HOLD-001` phải tham chiếu ID số của reservation; kết quả kiểm kê demo `MATCHED` đổi thành enum `FOUND`. Đã sửa cả file SQL và các bản ghi demo tương ứng, **không nạp lại/reset seed**.

Bộ kiểm thử ghi tạo dữ liệu riêng có tiền tố `AUDIT-`: sau kiểm thử tài khoản bị soft-delete, đơn/hợp đồng bị hủy, thiết bị chuyển RETIRED và kho tắt hoạt động. Phiếu kho, lịch sử và các bản ghi kiểm thử vẫn được giữ để truy vết; không xóa dữ liệu của người dùng.

Các kiểm tra đã chạy thành công:

- Frontend: build, lint và 10 regression test.
- 32 trường hợp role/route với API local, gồm drawer báo giá, giữ đúng URL chi tiết ID số và mở tất cả tab kho.
- Ba bài kiểm thử ghi qua API thật: scope/quyền, form tài khoản và toàn bộ luồng kho → thuê → gia hạn; có xác nhận sai bị từ chối và hủy đơn có hợp đồng bị chặn.
- Maven: 111 test các module core và shared, không lỗi.

Kiểm thử render dùng React/jsdom với API thật, **không phải browser E2E**. Không kiểm thử chất lượng AI hay chữ ký số.

```bash
npm test
npm run build
npm run lint
# Cần Gateway + bốn service và tài khoản demo đã seed:
npm run test:live
# Có ghi dữ liệu AUDIT-* vào database demo; không chạy trên dữ liệu production:
npm run test:workflow
```

## Phần ngoài phạm vi vẫn cần bổ sung

- Admin: gán user Manager vào chi nhánh theo UI, danh mục cha/con và xóa danh mục chưa có luồng backend đầy đủ.
- Các bảng chi tiết còn dùng nhãn `#ID` cho một số tên khách hàng/chi nhánh/model; chưa tích hợp hóa đơn/thanh toán.
- Endpoint tìm thiết bị qua Rental `/api/v1/equipment/search` vẫn là stub; các luồng mới không dùng nó. QR Inventory cũng mới là stub, không đưa vào màn hình Operations mới.
- AI giữ cấu hình kết nối hiện có và chạy riêng; các chức năng thuê/kho không yêu cầu bật AI.
