## Collaboration Rule

1. Một file chỉ có một owner tại một thời điểm.
2. Trước khi sửa file dùng chung, phải thông báo `[LOCK] path/to/file — owner — branch — mục đích`.
3. Không sửa file đang được người khác `[LOCK]` nếu chưa thống nhất.
4. Không để hai branch cùng sửa các file dễ conflict như screen, navigator, store, view model, shared types hoặc shared hooks.
5. Người tạo component chỉ sửa component; screen owner chịu trách nhiệm tích hợp component vào screen.
6. Trước khi tạo feature branch, phải cập nhật branch đích mới nhất.
7. Chỉ pull code khi đang đứng đúng branch; không chạy `git pull origin <branch-khác>` trên feature branch.
8. Shared changes phải được tách PR và merge trước, sau đó các branch liên quan cập nhật lại branch đích.
9. Trước khi mở PR, feature branch phải đồng bộ với branch đích bằng `git fetch` và `git rebase`.
10. Mỗi PR phải nhỏ, chỉ chứa một mục đích và không sửa hoặc format file ngoài phạm vi.
11. Không giải quyết conflict bằng cách chọn toàn bộ `ours`, `theirs` hoặc ghi đè toàn bộ file.
12. Khi có conflict, phải đọc thay đổi của cả hai phía và giữ đầy đủ chức năng cần thiết.
13. Trước khi merge phải chạy:
    - `npx tsc --noEmit`
    - `npx eslint <các-file-đã-sửa>`
    - `git diff --check`
    - kiểm tra UI liên quan
14. Không merge khi còn conflict marker, TypeScript error, ESLint error hoặc UI chưa được kiểm tra.
15. Chỉ `[UNLOCK]` file sau khi PR đã merge và code trên branch đích hoạt động đúng.
16. Chỉ được viết tối đa 300 dòng 1 file những file nào có thể thêm chức năng ở đấy thì phải tính toán thêm để khi thêm vào code không bị phình to.
17. Có thể tạo hook nếu cảm thấy cần thiết nhưng chỉ được tạo hook khi trong module đấy và nếu tạo hook trên shared phải hỏi trước.
18. Luôn luôn hỏi những file cần thiết để hiểu sâu về những chức năng thêm vào hoặc sửa đổi.
19. Khi thay đổi giao diện cũ cần báo lại là thay đổi ở phần nào.
20. Ưu tiên tận dụng các component, hook có sẵn trước.
