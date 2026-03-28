package com.nhom.backend.service;

import com.nhom.backend.dto.file.FileDecryptResponse;
import com.nhom.backend.dto.file.FileUploadResponse;
import com.nhom.backend.entity.EmployeeEntity;
import com.nhom.backend.entity.FileUploadEntity;
import com.nhom.backend.entity.UserEntity;
import com.nhom.backend.exception.BadRequestException;
import com.nhom.backend.exception.ResourceNotFoundException;
import com.nhom.backend.repository.EmployeeRepository;
import com.nhom.backend.repository.FileUploadRepository;
import com.nhom.backend.util.AesCore;
import com.nhom.backend.util.Pbkdf2Core;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.nhom.backend.dto.file.FileContentResponse;
import java.nio.charset.StandardCharsets;

import java.io.File;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

@Service
public class FileStorageService {

    private final EmployeeRepository employeeRepository;
    private final FileUploadRepository fileUploadRepository;
    private final AuditLogService auditLogService;

    @Value("${app.encrypted-dir}")
    private String encryptedDir;

    @Value("${app.decrypted-dir}")
    private String decryptedDir;

    public FileStorageService(EmployeeRepository employeeRepository,
            FileUploadRepository fileUploadRepository,
            AuditLogService auditLogService) {
        this.employeeRepository = employeeRepository;
        this.fileUploadRepository = fileUploadRepository;
        this.auditLogService = auditLogService;
    }

    public FileUploadResponse upload(UserEntity currentUser, MultipartFile file, String dataPassword) throws Exception {
        EmployeeEntity employee = getEmployeeByUser(currentUser);
        verifyDataPassword(employee, dataPassword);

        Files.createDirectories(Paths.get(encryptedDir));

        byte[] aesKey = getAesKey(employee, dataPassword);

        String originalFileName = file.getOriginalFilename();
        if (originalFileName == null || originalFileName.isBlank()) {
            originalFileName = "unknown.bin";
        }

        String encryptedName = System.currentTimeMillis() + "_" + originalFileName + ".enc";
        Path encryptedPath = Paths.get(encryptedDir, encryptedName);

        Path tempRawFile = null;

        try {
            // Tạo file tạm để phục vụ mã hóa, không lưu cố định vào project
            tempRawFile = Files.createTempFile("upload_", "_" + originalFileName);

            // Ghi nội dung upload vào file tạm
            Files.copy(file.getInputStream(), tempRawFile, StandardCopyOption.REPLACE_EXISTING);

            // Chỉ lưu file mã hóa vào thư mục encrypted
            AesCore.encryptFile(tempRawFile, encryptedPath, aesKey);

        } finally {
            // Xóa file gốc tạm ngay sau khi mã hóa xong
            if (tempRawFile != null) {
                Files.deleteIfExists(tempRawFile);
            }
        }

        FileUploadEntity entity = new FileUploadEntity();
        entity.setFileName(encryptedName);
        entity.setOriginalFileName(originalFileName);
        entity.setStoredPath(encryptedPath.toString());
        entity.setEmployee(employee);
        entity.setIsEncrypted(true);
        entity.setCreatedAt(LocalDateTime.now().toString());
        entity.setUpdatedAt(LocalDateTime.now().toString());

        FileUploadEntity saved = fileUploadRepository.save(entity);

        auditLogService.save(
                currentUser.getUsername(),
                "UPLOAD_FILE",
                "FILE",
                saved.getId(),
                "Upload encrypted file: " + originalFileName);

        return new FileUploadResponse(
                saved.getId(),
                saved.getFileName(),
                saved.getOriginalFileName(),
                saved.getIsEncrypted(),
                saved.getStoredPath(),
                saved.getCreatedAt());
    }

    public List<FileUploadEntity> getMyFiles(UserEntity currentUser) {
        EmployeeEntity employee = getEmployeeByUser(currentUser);
        return fileUploadRepository.findByEmployee(employee);
    }

    public FileUploadEntity getMyFileDetail(UserEntity currentUser, Long fileId) {
        EmployeeEntity employee = getEmployeeByUser(currentUser);
        return fileUploadRepository.findByIdAndEmployee(fileId, employee)
                .orElseThrow(() -> new ResourceNotFoundException("File not found"));
    }

    public FileDecryptResponse decryptFile(UserEntity currentUser, Long fileId, String dataPassword) throws Exception {
        EmployeeEntity employee = getEmployeeByUser(currentUser);
        verifyDataPassword(employee, dataPassword);

        FileUploadEntity fileUpload = fileUploadRepository.findByIdAndEmployee(fileId, employee)
                .orElseThrow(() -> new ResourceNotFoundException("File not found"));

        Files.createDirectories(Paths.get(decryptedDir));

        byte[] aesKey = getAesKey(employee, dataPassword);
        Path inputPath = Paths.get(fileUpload.getStoredPath());
        Path outputPath = Paths.get(decryptedDir, "decrypted_" + fileUpload.getOriginalFileName());

        AesCore.decryptFile(inputPath, outputPath, aesKey);

        auditLogService.save(
                currentUser.getUsername(),
                "DECRYPT_FILE",
                "FILE",
                fileUpload.getId(),
                "Decrypt file: " + fileUpload.getOriginalFileName());

        return new FileDecryptResponse(fileId, outputPath.toString(), "Decrypt success");
    }

    public Resource downloadDecryptedFile(UserEntity currentUser, Long fileId, String dataPassword) throws Exception {
        FileDecryptResponse decryptResponse = decryptFile(currentUser, fileId, dataPassword);
        Path outputPath = Paths.get(decryptResponse.getOutputPath());

        if (!Files.exists(outputPath)) {
            throw new ResourceNotFoundException("Decrypted file not found");
        }

        return new FileSystemResource(outputPath);
    }

    public void deleteMyFile(UserEntity currentUser, Long fileId) throws Exception {
        EmployeeEntity employee = getEmployeeByUser(currentUser);
        FileUploadEntity fileUpload = fileUploadRepository.findByIdAndEmployee(fileId, employee)
                .orElseThrow(() -> new ResourceNotFoundException("File not found"));

        Path encryptedPath = Paths.get(fileUpload.getStoredPath());
        Files.deleteIfExists(encryptedPath);

        fileUploadRepository.delete(fileUpload);

        auditLogService.save(
                currentUser.getUsername(),
                "DELETE_FILE",
                "FILE",
                fileId,
                "Delete file: " + fileUpload.getOriginalFileName());
    }

    private EmployeeEntity getEmployeeByUser(UserEntity currentUser) {
        return employeeRepository.findByUser(currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found"));
    }

    private void verifyDataPassword(EmployeeEntity employee, String dataPassword) {
        if (dataPassword == null || dataPassword.isBlank()) {
            throw new BadRequestException("dataPassword is required");
        }
        if (!Pbkdf2Core.verifyPassword(dataPassword, employee.getDataPasswordHash())) {
            throw new BadRequestException("Data password is incorrect");
        }
    }

    private byte[] getAesKey(EmployeeEntity employee, String dataPassword) {
        byte[] salt = Base64.getDecoder().decode(employee.getDataSalt());
        return Pbkdf2Core.deriveKey(dataPassword, salt, 10000, 16);
    }

    public void reEncryptAllFiles(EmployeeEntity employee, String oldDataPassword, String newDataPassword)
            throws Exception {
        List<FileUploadEntity> files = fileUploadRepository.findByEmployee(employee);

        byte[] salt = Base64.getDecoder().decode(employee.getDataSalt());
        byte[] oldAesKey = Pbkdf2Core.deriveKey(oldDataPassword, salt, 10000, 16);

        byte[] newAesKey = Pbkdf2Core.deriveKey(newDataPassword, salt, 10000, 16);

        Files.createDirectories(Paths.get(decryptedDir));
        Files.createDirectories(Paths.get(encryptedDir));

        for (FileUploadEntity file : files) {
            Path encryptedPath = Paths.get(file.getStoredPath());
            if (!Files.exists(encryptedPath)) {
                continue;
            }

            Path tempDecrypted = Paths.get(decryptedDir, "temp_" + file.getOriginalFileName());
            Path tempReEncrypted = Paths.get(encryptedDir, "reencrypted_" + file.getFileName());

            AesCore.decryptFile(encryptedPath, tempDecrypted, oldAesKey);
            AesCore.encryptFile(tempDecrypted, tempReEncrypted, newAesKey);

            Files.move(tempReEncrypted, encryptedPath, StandardCopyOption.REPLACE_EXISTING);
            Files.deleteIfExists(tempDecrypted);

            file.setUpdatedAt(LocalDateTime.now().toString());
            fileUploadRepository.save(file);
        }
    }

    public FileContentResponse viewMyFileContent(UserEntity currentUser, Long fileId, String dataPassword)
            throws Exception {
        EmployeeEntity employee = getEmployeeByUser(currentUser);
        return viewFileContentInternal(currentUser, employee, fileId, dataPassword, false);
    }

    public FileContentResponse viewFileContentByOwnerUserId(
            UserEntity currentUser,
            Long ownerUserId,
            Long fileId,
            String ownerDataPassword) throws Exception {
        EmployeeEntity ownerEmployee = employeeRepository.findByUserId(ownerUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Owner employee not found"));

        return viewFileContentInternal(currentUser, ownerEmployee, fileId, ownerDataPassword, true);
    }

    private FileContentResponse viewFileContentInternal(
            UserEntity currentUser,
            EmployeeEntity ownerEmployee,
            Long fileId,
            String dataPassword,
            boolean viewingOtherUser) throws Exception {
        verifyDataPassword(ownerEmployee, dataPassword);

        FileUploadEntity fileUpload = fileUploadRepository.findByIdAndEmployee(fileId, ownerEmployee)
                .orElseThrow(() -> new ResourceNotFoundException("File not found"));

        Files.createDirectories(Paths.get(decryptedDir));

        byte[] aesKey = getAesKey(ownerEmployee, dataPassword);

        Path inputPath = Paths.get(fileUpload.getStoredPath());
        Path outputPath = Paths.get(
                decryptedDir,
                "preview_" + System.currentTimeMillis() + "_" + fileUpload.getOriginalFileName());

        AesCore.decryptFile(inputPath, outputPath, aesKey);

        if (!Files.exists(outputPath)) {
            throw new ResourceNotFoundException("Decrypted file not found");
        }

        String content = Files.readString(outputPath, StandardCharsets.UTF_8);

        Files.deleteIfExists(outputPath);

        auditLogService.save(
                currentUser.getUsername(),
                viewingOtherUser ? "VIEW_OTHER_FILE_CONTENT" : "VIEW_MY_FILE_CONTENT",
                "FILE",
                fileUpload.getId(),
                (viewingOtherUser
                        ? "View content of other user's file: "
                        : "View own file content: ")
                        + fileUpload.getOriginalFileName());

        return new FileContentResponse(
                fileUpload.getId(),
                fileUpload.getOriginalFileName(),
                content,
                "View file content success");
    }
}