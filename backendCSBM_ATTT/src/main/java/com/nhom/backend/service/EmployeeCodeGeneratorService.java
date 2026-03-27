package com.nhom.backend.service;

import com.nhom.backend.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

@Service
public class EmployeeCodeGeneratorService {

    private final EmployeeRepository employeeRepository;

    public EmployeeCodeGeneratorService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public synchronized String generateNextCode() {
        Long maxNumber = employeeRepository.findMaxEmployeeCodeNumber();
        long nextNumber = (maxNumber == null) ? 1 : maxNumber + 1;
        return String.format("EMP%05d", nextNumber);
    }
}