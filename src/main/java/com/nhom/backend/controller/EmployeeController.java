package com.nhom.backend.controller;

import com.nhom.backend.dto.EmployeeRequest;
import com.nhom.backend.dto.EmployeeResponse;
import com.nhom.backend.entity.Employee;
import com.nhom.backend.service.EmployeeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "http://localhost:5173")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    public List<EmployeeResponse> getAll() {
        return employeeService.getAll();
    }

    @GetMapping("/{id}")
    public EmployeeResponse getDetail(@PathVariable Long id) {
        return employeeService.getDetail(id);
    }

    @PostMapping
    public Employee create(@RequestBody EmployeeRequest request) {
        return employeeService.create(request);
    }
}