export type Employee = {
  id: number;
  code?: string;
  name?: string;
  gender?: string;
  dateOfBirth?: string;
  probationaryStartDate?: string;
  probationaryEndDate?: string;
  officialStartDate?: string;
  type?: string;
  level?: string;
  graduationYear?: string;
  education?: string;

  email?: string;
  taxCode?: string;
  socialInsuranceCode?: string;
  phoneNumber?: string;
  citizenIdentificationCode?: string;
  personalEmail?: string;
  birthplace?: string;
  currentAddress?: string;
  permanentAddress?: string;
  bankName?: string;
  bankAccountNumber?: string;

  unlocked?: boolean;
};

export type EmployeeCreateRequest = {
  name: string;
  gender?: string;
  dateOfBirth?: string;
  probationaryStartDate?: string;
  probationaryEndDate?: string;
  officialStartDate?: string;
  type?: string;
  level?: string;
  graduationYear?: string;
  education?: string;

  email?: string;
  taxCode?: string;
  socialInsuranceCode?: string;
  phoneNumber?: string;
  citizenIdentificationCode?: string;
  personalEmail?: string;
  birthplace?: string;
  currentAddress?: string;
  permanentAddress?: string;
  bankName?: string;
  bankAccountNumber?: string;

  dataPassword: string;
};

export type EmployeeProfileRequest = {
  userId?: number;
  code?: string;
  name?: string;
  gender?: string;
  dateOfBirth?: string;
  probationaryStartDate?: string;
  probationaryEndDate?: string;
  officialStartDate?: string;
  type?: string;
  level?: string;
  graduationYear?: string;
  education?: string;

  email?: string;
  taxCode?: string;
  socialInsuranceCode?: string;
  phoneNumber?: string;
  citizenIdentificationCode?: string;
  personalEmail?: string;
  birthplace?: string;
  currentAddress?: string;
  permanentAddress?: string;
  bankName?: string;
  bankAccountNumber?: string;

  dataPassword?: string;
};

export type EmployeeUpdateRequest = {
  code?: string;
  name?: string;
  gender?: string;
  dateOfBirth?: string;
  probationaryStartDate?: string;
  probationaryEndDate?: string;
  officialStartDate?: string;
  type?: string;
  level?: string;
  graduationYear?: string;
  education?: string;

  email?: string;
  taxCode?: string;
  socialInsuranceCode?: string;
  phoneNumber?: string;
  citizenIdentificationCode?: string;
  personalEmail?: string;
  birthplace?: string;
  currentAddress?: string;
  permanentAddress?: string;
  bankName?: string;
  bankAccountNumber?: string;

  dataPassword?: string;
};

export type EmployeeSearchRequest = {
  code?: string;
  name?: string;
  gender?: string;
  type?: string;
  level?: string;
  education?: string;
  graduationYear?: string;
};

export type ChangeDataPasswordRequest = {
  oldDataPassword: string;
  newDataPassword: string;
};