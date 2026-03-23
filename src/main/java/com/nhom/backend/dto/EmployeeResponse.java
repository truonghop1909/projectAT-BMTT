package com.nhom.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeResponse {
    private Long id;
    private String employeeCode;
    private String fullName;
    private String cccd;
    private String phone;
    private String email;
    private String address;
    private String bankAccount;
    private String salary;
    private String departmentName;
    private String positionName;
}