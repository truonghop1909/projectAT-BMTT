package com.nhom.backend.repository;

import com.nhom.backend.entity.EmployeeEntity;
import com.nhom.backend.entity.FileUploadEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FileUploadRepository extends JpaRepository<FileUploadEntity, Long> {
    List<FileUploadEntity> findByEmployee(EmployeeEntity employee);
    Optional<FileUploadEntity> findByIdAndEmployee(Long id, EmployeeEntity employee);
    void deleteByEmployeeId(Long employeeId);
}