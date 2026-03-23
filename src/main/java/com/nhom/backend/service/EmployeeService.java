package com.nhom.backend.service;

import com.nhom.backend.dto.EmployeeRequest;
import com.nhom.backend.dto.EmployeeResponse;
import com.nhom.backend.entity.Department;
import com.nhom.backend.entity.Employee;
import com.nhom.backend.entity.Position;
import com.nhom.backend.repository.DepartmentRepository;
import com.nhom.backend.repository.EmployeeRepository;
import com.nhom.backend.repository.PositionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final PositionRepository positionRepository;

    public EmployeeService(EmployeeRepository employeeRepository,
                           DepartmentRepository departmentRepository,
                           PositionRepository positionRepository) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.positionRepository = positionRepository;
    }

    public Employee create(EmployeeRequest request) {
        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));

        Position position = positionRepository.findById(request.getPositionId())
                .orElseThrow(() -> new RuntimeException("Position not found"));

        Employee employee = new Employee();
        employee.setEmployeeCode(request.getEmployeeCode());
        employee.setFullName(request.getFullName());
        employee.setCccd(request.getCccd());
        employee.setPhone(request.getPhone());
        employee.setEmail(request.getEmail());
        employee.setAddress(request.getAddress());
        employee.setBankAccount(request.getBankAccount());
        employee.setSalary(request.getSalary());
        employee.setDepartment(department);
        employee.setPosition(position);

        return employeeRepository.save(employee);
    }

    public List<EmployeeResponse> getAll() {
        return employeeRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public EmployeeResponse getDetail(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        return convertToResponse(employee);
    }

    private EmployeeResponse convertToResponse(Employee employee) {
        return EmployeeResponse.builder()
                .id(employee.getId())
                .employeeCode(employee.getEmployeeCode())
                .fullName(employee.getFullName())
                .cccd(employee.getCccd())
                .phone(employee.getPhone())
                .email(employee.getEmail())
                .address(employee.getAddress())
                .bankAccount(employee.getBankAccount())
                .salary(employee.getSalary())
                .departmentName(employee.getDepartment() != null ? employee.getDepartment().getName() : "")
                .positionName(employee.getPosition() != null ? employee.getPosition().getName() : "")
                .build();
    }
}