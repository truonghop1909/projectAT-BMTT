package com.nhom.backend.controller;

import com.nhom.backend.dto.file.FileContentResponse;
import com.nhom.backend.dto.file.FileDecryptResponse;
import com.nhom.backend.dto.file.FileUploadResponse;
import com.nhom.backend.entity.FileUploadEntity;
import com.nhom.backend.entity.UserEntity;
import com.nhom.backend.service.FileStorageService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final FileStorageService fileStorageService;

    public FileController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    /**
     * API upload file của user hiện tại
     * - Nhận file từ multipart/form-data
     * - Nhận dataPassword để xác thực và sinh AES key
     * - File upload sẽ được mã hóa
     * - Hệ thống chỉ lưu file mã hóa trong thư mục encrypted
     * - Không lưu file gốc cố định trong project
     * - Trả về thông tin file đã upload
     */
    @PostMapping("/upload")
    public ResponseEntity<FileUploadResponse> upload(
            @RequestAttribute("currentUser") UserEntity currentUser,
            @RequestParam("file") MultipartFile file,
            @RequestParam("dataPassword") String dataPassword) throws Exception {
        return ResponseEntity.ok(fileStorageService.upload(currentUser, file, dataPassword));
    }

    /**
     * API lấy danh sách file của chính user hiện tại
     * - Chỉ trả về các file thuộc employee gắn với user đang đăng nhập
     */
    @GetMapping("/my-files")
    public ResponseEntity<List<FileUploadEntity>> getMyFiles(
            @RequestAttribute("currentUser") UserEntity currentUser) {
        return ResponseEntity.ok(fileStorageService.getMyFiles(currentUser));
    }

    /**
     * API lấy chi tiết 1 file theo fileId
     * - Chỉ được xem file thuộc về chính mình
     */
    @GetMapping("/{fileId}")
    public ResponseEntity<FileUploadEntity> getFileDetail(
            @RequestAttribute("currentUser") UserEntity currentUser,
            @PathVariable Long fileId) {
        return ResponseEntity.ok(fileStorageService.getMyFileDetail(currentUser, fileId));
    }

    /**
     * API giải mã file theo fileId
     * - Kiểm tra dataPassword
     * - Giải mã file từ thư mục encrypted sang thư mục decrypted
     * - Trả về đường dẫn file sau giải mã
     */
    @PostMapping("/decrypt/{fileId}")
    public ResponseEntity<FileDecryptResponse> decrypt(
            @RequestAttribute("currentUser") UserEntity currentUser,
            @PathVariable Long fileId,
            @RequestParam("dataPassword") String dataPassword) throws Exception {
        return ResponseEntity.ok(fileStorageService.decryptFile(currentUser, fileId, dataPassword));
    }

    /**
     * API tải file đã giải mã
     * - Hệ thống sẽ giải mã file trước
     * - Sau đó trả về Resource để trình duyệt / Postman tải file
     * - Content-Disposition dùng để ép tải file về máy
     */
    @GetMapping("/download/{fileId}")
    public ResponseEntity<Resource> downloadDecrypted(
            @RequestAttribute("currentUser") UserEntity currentUser,
            @PathVariable Long fileId,
            @RequestParam("dataPassword") String dataPassword) throws Exception {
        Resource resource = fileStorageService.downloadDecryptedFile(currentUser, fileId, dataPassword);
        String filename = resource.getFilename() == null ? "download.bin" : resource.getFilename();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }

    /**
     * API xóa file của chính mình
     * - Xóa file mã hóa trong thư mục lưu trữ
     * - Xóa bản ghi file trong database
     */
    @DeleteMapping("/{fileId}")
    public ResponseEntity<String> deleteMyFile(
            @RequestAttribute("currentUser") UserEntity currentUser,
            @PathVariable Long fileId) throws Exception {
        fileStorageService.deleteMyFile(currentUser, fileId);
        return ResponseEntity.ok("Deleted file successfully");
    }

    /**
     * Xem nội dung file text của chính mình
     */
    @GetMapping("/view-content/{fileId}")
    public ResponseEntity<FileContentResponse> viewMyFileContent(
            @RequestAttribute("currentUser") UserEntity currentUser,
            @PathVariable Long fileId,
            @RequestParam("dataPassword") String dataPassword) throws Exception {
        return ResponseEntity.ok(fileStorageService.viewMyFileContent(currentUser, fileId, dataPassword));
    }

}