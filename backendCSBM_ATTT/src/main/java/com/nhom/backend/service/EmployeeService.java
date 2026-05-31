package com.nhom.backend.service;

import com.nhom.backend.dto.employee.EmployeeCreateRequest;
import com.nhom.backend.dto.employee.EmployeeResponse;
import com.nhom.backend.dto.employee.EmployeeUpdateRequest;
import com.nhom.backend.entity.EmployeeEntity;
import com.nhom.backend.entity.UserEntity;
import com.nhom.backend.exception.BadRequestException;
import com.nhom.backend.exception.ResourceNotFoundException;
import com.nhom.backend.repository.EmployeeRepository;
import com.nhom.backend.util.CryptoFieldUtil;
import com.nhom.backend.util.Pbkdf2Core;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

import com.nhom.backend.dto.employee.EmployeeSearchRequest;
import com.nhom.backend.repository.specification.EmployeeSpecification;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final AuditLogService auditLogService;
    private final EmployeeCodeGeneratorService employeeCodeGeneratorService;
    private final FileStorageService fileStorageService;

    public EmployeeService(EmployeeRepository employeeRepository,
            AuditLogService auditLogService,
            EmployeeCodeGeneratorService employeeCodeGeneratorService,
            FileStorageService fileStorageService) {
        this.employeeRepository = employeeRepository;
        this.auditLogService = auditLogService;
        this.employeeCodeGeneratorService = employeeCodeGeneratorService;
        this.fileStorageService = fileStorageService;
    }

    public EmployeeResponse createProfile(UserEntity currentUser, EmployeeCreateRequest request) {

        if (employeeRepository.findByUser(currentUser).isPresent()) {
            throw new BadRequestException("Employee profile already exists");
        }

        if (request.getDataPassword() == null || request.getDataPassword().isBlank()) {
            throw new BadRequestException("dataPassword is required");
        }

        byte[] salt = Pbkdf2Core.randomSalt(16);
        String saltBase64 = Base64.getEncoder().encodeToString(salt);

        String dataPasswordHash = Pbkdf2Core.encodePbkdf2(request.getDataPassword(), salt, 10000, 32);
        byte[] aesKey = Pbkdf2Core.deriveKey(request.getDataPassword(), salt, 10000, 16);

        EmployeeEntity employee = new EmployeeEntity();
        employee.setCode(employeeCodeGeneratorService.generateNextCode());
        employee.setName(request.getName());
        employee.setGender(request.getGender());
        employee.setDateOfBirth(request.getDateOfBirth());
        employee.setProbationaryStartDate(request.getProbationaryStartDate());
        employee.setProbationaryEndDate(request.getProbationaryEndDate());
        employee.setOfficialStartDate(request.getOfficialStartDate());
        employee.setType(request.getType());
        employee.setLevel(request.getLevel());
        employee.setGraduationYear(request.getGraduationYear());
        employee.setEducation(request.getEducation());
        // ma hoa
        applyEncryptedFields(employee, request, aesKey);

        employee.setDataSalt(saltBase64);
        employee.setDataPasswordHash(dataPasswordHash);

        employee.setCreatedAt(LocalDateTime.now().toString());
        employee.setUpdatedAt(LocalDateTime.now().toString());

        employee.setUser(currentUser);

        EmployeeEntity saved = employeeRepository.save(employee);

        auditLogService.save(
                currentUser.getUsername(),
                "CREATE",
                "EMPLOYEE",
                saved.getId(),
                "Create employee profile with code: " + saved.getCode());

        return toResponse(saved, request.getDataPassword());
    }

    public EmployeeResponse updateMyProfile(UserEntity currentUser, EmployeeUpdateRequest request) {

        EmployeeEntity employee = employeeRepository.findByUser(currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found"));

        if (request.getDataPassword() == null || request.getDataPassword().isBlank()) {
            throw new BadRequestException("dataPassword is required");
        }

        if (!Pbkdf2Core.verifyPassword(request.getDataPassword(), employee.getDataPasswordHash())) {
            throw new BadRequestException("Data password is incorrect");
        }

        byte[] salt = Base64.getDecoder().decode(employee.getDataSalt());
        byte[] aesKey = Pbkdf2Core.deriveKey(request.getDataPassword(), salt, 10000, 16);

        if (request.getCode() != null && !request.getCode().equals(employee.getCode())) {
            if (employeeRepository.existsByCode(request.getCode())) {
                throw new BadRequestException("Employee code already exists");
            }
            employee.setCode(request.getCode());
        }

        employee.setName(request.getName());
        employee.setGender(request.getGender());
        employee.setDateOfBirth(request.getDateOfBirth());
        employee.setProbationaryStartDate(request.getProbationaryStartDate());
        employee.setProbationaryEndDate(request.getProbationaryEndDate());
        employee.setOfficialStartDate(request.getOfficialStartDate());
        employee.setType(request.getType());
        employee.setLevel(request.getLevel());
        employee.setGraduationYear(request.getGraduationYear());
        employee.setEducation(request.getEducation());
        // ma hoa
        applyEncryptedFields(employee, request, aesKey);

        employee.setUpdatedAt(LocalDateTime.now().toString());

        EmployeeEntity saved = employeeRepository.save(employee);

        auditLogService.save(
                currentUser.getUsername(),
                "UPDATE",
                "EMPLOYEE",
                saved.getId(),
                "Update employee profile");

        return toResponse(saved, request.getDataPassword());
    }

    public EmployeeResponse getMyProfile(UserEntity currentUser, String dataPassword) {
        EmployeeEntity employee = employeeRepository.findByUser(currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found"));

        return toResponse(employee, dataPassword);
    }

    public List<EmployeeResponse> getAll(String dataPassword) {
        return employeeRepository.findAll()
                .stream()
                .map(e -> toResponse(e, dataPassword))
                .collect(Collectors.toList());
    }

    public EmployeeResponse getById(Long id, String dataPassword) {
        EmployeeEntity employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        return toResponse(employee, dataPassword);
    }

    public void deleteMyProfile(UserEntity currentUser) {
        EmployeeEntity employee = employeeRepository.findByUser(currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found"));

        Long employeeId = employee.getId();
        String employeeCode = employee.getCode();

        employeeRepository.delete(employee);

        auditLogService.save(
                currentUser.getUsername(),
                "DELETE",
                "EMPLOYEE",
                employeeId,
                "Delete employee profile with code: " + employeeCode);
    }

    private void applyEncryptedFields(EmployeeEntity employee, EmployeeCreateRequest request, byte[] aesKey) {
        employee.setEmailEnc(CryptoFieldUtil.encryptString(request.getEmail(), aesKey));
        employee.setTaxCodeEnc(CryptoFieldUtil.encryptString(request.getTaxCode(), aesKey));
        employee.setSocialInsuranceCodeEnc(CryptoFieldUtil.encryptString(request.getSocialInsuranceCode(), aesKey));
        employee.setPhoneNumberEnc(CryptoFieldUtil.encryptString(request.getPhoneNumber(), aesKey));
        employee.setCitizenIdentificationCodeEnc(
                CryptoFieldUtil.encryptString(request.getCitizenIdentificationCode(), aesKey));
        employee.setPersonalEmailEnc(CryptoFieldUtil.encryptString(request.getPersonalEmail(), aesKey));
        employee.setBirthplaceEnc(CryptoFieldUtil.encryptString(request.getBirthplace(), aesKey));
        employee.setCurrentAddressEnc(CryptoFieldUtil.encryptString(request.getCurrentAddress(), aesKey));
        employee.setPermanentAddressEnc(CryptoFieldUtil.encryptString(request.getPermanentAddress(), aesKey));
        employee.setBankNameEnc(CryptoFieldUtil.encryptString(request.getBankName(), aesKey));
        employee.setBankAccountNumberEnc(CryptoFieldUtil.encryptString(request.getBankAccountNumber(), aesKey));
    }

    private void applyEncryptedFields(EmployeeEntity employee, EmployeeUpdateRequest request, byte[] aesKey) {
        employee.setEmailEnc(CryptoFieldUtil.encryptString(request.getEmail(), aesKey));
        employee.setTaxCodeEnc(CryptoFieldUtil.encryptString(request.getTaxCode(), aesKey));
        employee.setSocialInsuranceCodeEnc(CryptoFieldUtil.encryptString(request.getSocialInsuranceCode(), aesKey));
        employee.setPhoneNumberEnc(CryptoFieldUtil.encryptString(request.getPhoneNumber(), aesKey));
        employee.setCitizenIdentificationCodeEnc(
                CryptoFieldUtil.encryptString(request.getCitizenIdentificationCode(), aesKey));
        employee.setPersonalEmailEnc(CryptoFieldUtil.encryptString(request.getPersonalEmail(), aesKey));
        employee.setBirthplaceEnc(CryptoFieldUtil.encryptString(request.getBirthplace(), aesKey));
        employee.setCurrentAddressEnc(CryptoFieldUtil.encryptString(request.getCurrentAddress(), aesKey));
        employee.setPermanentAddressEnc(CryptoFieldUtil.encryptString(request.getPermanentAddress(), aesKey));
        employee.setBankNameEnc(CryptoFieldUtil.encryptString(request.getBankName(), aesKey));
        employee.setBankAccountNumberEnc(CryptoFieldUtil.encryptString(request.getBankAccountNumber(), aesKey));
    }

    private EmployeeResponse toResponse(EmployeeEntity employee, String dataPassword) {
        EmployeeResponse response = new EmployeeResponse();
        response.setId(employee.getId());
        response.setCode(employee.getCode());
        response.setName(employee.getName());
        response.setGender(employee.getGender());
        response.setDateOfBirth(employee.getDateOfBirth());
        response.setProbationaryStartDate(employee.getProbationaryStartDate());
        response.setProbationaryEndDate(employee.getProbationaryEndDate());
        response.setOfficialStartDate(employee.getOfficialStartDate());
        response.setType(employee.getType());
        response.setLevel(employee.getLevel());
        response.setGraduationYear(employee.getGraduationYear());
        response.setEducation(employee.getEducation());

        boolean unlocked = false;
        if (dataPassword != null && !dataPassword.isBlank()) {
            unlocked = Pbkdf2Core.verifyPassword(dataPassword, employee.getDataPasswordHash());
        }
        response.setUnlocked(unlocked);

        if (unlocked) {
            byte[] salt = Base64.getDecoder().decode(employee.getDataSalt());
            byte[] aesKey = Pbkdf2Core.deriveKey(dataPassword, salt, 10000, 16);

            response.setEmail(CryptoFieldUtil.decryptString(employee.getEmailEnc(), aesKey));
            response.setTaxCode(CryptoFieldUtil.decryptString(employee.getTaxCodeEnc(), aesKey));
            response.setSocialInsuranceCode(
                    CryptoFieldUtil.decryptString(employee.getSocialInsuranceCodeEnc(), aesKey));
            response.setPhoneNumber(CryptoFieldUtil.decryptString(employee.getPhoneNumberEnc(), aesKey));
            response.setCitizenIdentificationCode(
                    CryptoFieldUtil.decryptString(employee.getCitizenIdentificationCodeEnc(), aesKey));
            response.setPersonalEmail(CryptoFieldUtil.decryptString(employee.getPersonalEmailEnc(), aesKey));
            response.setBirthplace(CryptoFieldUtil.decryptString(employee.getBirthplaceEnc(), aesKey));
            response.setCurrentAddress(CryptoFieldUtil.decryptString(employee.getCurrentAddressEnc(), aesKey));
            response.setPermanentAddress(CryptoFieldUtil.decryptString(employee.getPermanentAddressEnc(), aesKey));
            response.setBankName(CryptoFieldUtil.decryptString(employee.getBankNameEnc(), aesKey));
            response.setBankAccountNumber(CryptoFieldUtil.decryptString(employee.getBankAccountNumberEnc(), aesKey));
        } else {
            response.setEmail(CryptoFieldUtil.mask());
            response.setTaxCode(CryptoFieldUtil.mask());
            response.setSocialInsuranceCode(CryptoFieldUtil.mask());
            response.setPhoneNumber(CryptoFieldUtil.mask());
            response.setCitizenIdentificationCode(CryptoFieldUtil.mask());
            response.setPersonalEmail(CryptoFieldUtil.mask());
            response.setBirthplace(CryptoFieldUtil.mask());
            response.setCurrentAddress(CryptoFieldUtil.mask());
            response.setPermanentAddress(CryptoFieldUtil.mask());
            response.setBankName(CryptoFieldUtil.mask());
            response.setBankAccountNumber(CryptoFieldUtil.mask());
        }

        return response;
    }

    public void changeDataPassword(UserEntity currentUser, String oldDataPassword, String newDataPassword) {
        EmployeeEntity employee = employeeRepository.findByUser(currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found"));

        if (oldDataPassword == null || oldDataPassword.isBlank()) {
            throw new BadRequestException("Old data password is required");
        }
        if (newDataPassword == null || newDataPassword.isBlank()) {
            throw new BadRequestException("New data password is required");
        }

        if (!Pbkdf2Core.verifyPassword(oldDataPassword, employee.getDataPasswordHash())) {
            throw new BadRequestException("Old data password is incorrect");
        }

        try {
            byte[] salt = Base64.getDecoder().decode(employee.getDataSalt());
            byte[] oldAesKey = Pbkdf2Core.deriveKey(oldDataPassword, salt, 10000, 16);

            String email = CryptoFieldUtil.decryptString(employee.getEmailEnc(), oldAesKey);
            String taxCode = CryptoFieldUtil.decryptString(employee.getTaxCodeEnc(), oldAesKey);
            String socialInsuranceCode = CryptoFieldUtil.decryptString(employee.getSocialInsuranceCodeEnc(), oldAesKey);
            String phoneNumber = CryptoFieldUtil.decryptString(employee.getPhoneNumberEnc(), oldAesKey);
            String citizenIdentificationCode = CryptoFieldUtil.decryptString(employee.getCitizenIdentificationCodeEnc(),
                    oldAesKey);
            String personalEmail = CryptoFieldUtil.decryptString(employee.getPersonalEmailEnc(), oldAesKey);
            String birthplace = CryptoFieldUtil.decryptString(employee.getBirthplaceEnc(), oldAesKey);
            String currentAddress = CryptoFieldUtil.decryptString(employee.getCurrentAddressEnc(), oldAesKey);
            String permanentAddress = CryptoFieldUtil.decryptString(employee.getPermanentAddressEnc(), oldAesKey);
            String bankName = CryptoFieldUtil.decryptString(employee.getBankNameEnc(), oldAesKey);
            String bankAccountNumber = CryptoFieldUtil.decryptString(employee.getBankAccountNumberEnc(), oldAesKey);

            // re-encrypt file trước
            fileStorageService.reEncryptAllFiles(employee, oldDataPassword, newDataPassword);

            // dữ liệu employee dùng cùng salt, chỉ đổi password
            byte[] newAesKey = Pbkdf2Core.deriveKey(newDataPassword, salt, 10000, 16);
            String newHash = Pbkdf2Core.encodePbkdf2(newDataPassword, salt, 10000, 32);

            employee.setEmailEnc(CryptoFieldUtil.encryptString(email, newAesKey));
            employee.setTaxCodeEnc(CryptoFieldUtil.encryptString(taxCode, newAesKey));
            employee.setSocialInsuranceCodeEnc(CryptoFieldUtil.encryptString(socialInsuranceCode, newAesKey));
            employee.setPhoneNumberEnc(CryptoFieldUtil.encryptString(phoneNumber, newAesKey));
            employee.setCitizenIdentificationCodeEnc(
                    CryptoFieldUtil.encryptString(citizenIdentificationCode, newAesKey));
            employee.setPersonalEmailEnc(CryptoFieldUtil.encryptString(personalEmail, newAesKey));
            employee.setBirthplaceEnc(CryptoFieldUtil.encryptString(birthplace, newAesKey));
            employee.setCurrentAddressEnc(CryptoFieldUtil.encryptString(currentAddress, newAesKey));
            employee.setPermanentAddressEnc(CryptoFieldUtil.encryptString(permanentAddress, newAesKey));
            employee.setBankNameEnc(CryptoFieldUtil.encryptString(bankName, newAesKey));
            employee.setBankAccountNumberEnc(CryptoFieldUtil.encryptString(bankAccountNumber, newAesKey));

            employee.setDataPasswordHash(newHash);
            employee.setUpdatedAt(LocalDateTime.now().toString());

            employeeRepository.save(employee);

            auditLogService.save(
                    currentUser.getUsername(),
                    "CHANGE_DATA_PASSWORD",
                    "EMPLOYEE",
                    employee.getId(),
                    "Change shared data password for employee data and files");
        } catch (Exception e) {
            throw new BadRequestException("Change data password failed: " + e.getMessage());
        }
    }

    public List<EmployeeResponse> search(EmployeeSearchRequest request, String dataPassword) {
        return employeeRepository.findAll(EmployeeSpecification.build(request))
                .stream()
                .map(e -> toResponse(e, dataPassword))
                .collect(Collectors.toList());
    }

}