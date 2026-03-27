package com.nhom.backend.repository;

import com.nhom.backend.entity.EmployeeEntity;
import com.nhom.backend.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<EmployeeEntity, Long>, JpaSpecificationExecutor<EmployeeEntity> {
    Optional<EmployeeEntity> findByUser(UserEntity user);
    boolean existsByCode(String code);

    @Query("select count(e) from EmployeeEntity e")
    long countAllEmployees();
    Optional<EmployeeEntity> findByUserId(Long userId);

    @Query(value = "SELECT MAX(CAST(SUBSTRING(code, 4) AS UNSIGNED)) FROM employees_information", nativeQuery = true)
    Long findMaxEmployeeCodeNumber();
}