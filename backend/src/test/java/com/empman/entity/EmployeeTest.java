package com.empman.entity;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit Tests for Employee Entity
 * 
 * Tests validation constraints and JPA lifecycle callbacks.
 * Validates that the Employee entity enforces all business rules.
 * 
 * Test Coverage:
 * - Field validation (not null, email format, positive salary)
 * - JPA lifecycle callbacks (createdAt, updatedAt)
 * - Builder pattern
 * - ToString method
 * 
 * @since 1.0.0
 */
@DisplayName("Employee Entity Tests")
class EmployeeTest {

    private Validator validator;
    private Employee validEmployee;

    /**
     * Setup validator and create a valid employee instance for testing.
     */
    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();

        validEmployee = Employee.builder()
                .id(1L)
                .name("John Doe")
                .email("john.doe@bank.com")
                .department("Finance")
                .salary(BigDecimal.valueOf(75000.00))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    /**
     * Test: Valid employee should pass all validation constraints
     */
    @Test
    @DisplayName("Valid employee passes validation")
    void testValidEmployeePassesValidation() {
        Set<ConstraintViolation<Employee>> violations = validator.validate(validEmployee);
        assertTrue(violations.isEmpty(), "Valid employee should have no constraint violations");
    }

    /**
     * Test: Employee name is required (not null)
     */
    @Test
    @DisplayName("Employee name is required")
    void testEmployeeNameIsRequired() {
        validEmployee.setName(null);
        Set<ConstraintViolation<Employee>> violations = validator.validate(validEmployee);
        assertFalse(violations.isEmpty(), "Name cannot be null");
        assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("required")),
                "Should have validation error for required name");
    }

    /**
     * Test: Employee name cannot be blank or whitespace-only
     */
    @Test
    @DisplayName("Employee name cannot be blank")
    void testEmployeeNameCannotBeBlank() {
        validEmployee.setName("   ");
        Set<ConstraintViolation<Employee>> violations = validator.validate(validEmployee);
        assertFalse(violations.isEmpty(), "Name cannot be blank or whitespace");
        assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("required")),
                "Should have validation error for blank name");
    }

    /**
     * Test: Employee email is required (not null)
     */
    @Test
    @DisplayName("Employee email is required")
    void testEmployeeEmailIsRequired() {
        validEmployee.setEmail(null);
        Set<ConstraintViolation<Employee>> violations = validator.validate(validEmployee);
        assertFalse(violations.isEmpty(), "Email cannot be null");
        assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("required")),
                "Should have validation error for required email");
    }

    /**
     * Test: Employee email must follow valid email format
     */
    @Test
    @DisplayName("Employee email must be valid format")
    void testEmployeeEmailFormatValidation() {
        validEmployee.setEmail("invalid-email-format");
        Set<ConstraintViolation<Employee>> violations = validator.validate(validEmployee);
        assertFalse(violations.isEmpty(), "Invalid email format should fail validation");
        assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("valid")),
                "Should have validation error for invalid email format");
    }

    /**
     * Test: Employee department is required (not null)
     */
    @Test
    @DisplayName("Employee department is required")
    void testEmployeeDepartmentIsRequired() {
        validEmployee.setDepartment(null);
        Set<ConstraintViolation<Employee>> violations = validator.validate(validEmployee);
        assertFalse(violations.isEmpty(), "Department cannot be null");
        assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("required")),
                "Should have validation error for required department");
    }

    /**
     * Test: Employee salary is required (not null)
     */
    @Test
    @DisplayName("Employee salary is required")
    void testEmployeeSalaryIsRequired() {
        validEmployee.setSalary(null);
        Set<ConstraintViolation<Employee>> violations = validator.validate(validEmployee);
        assertFalse(violations.isEmpty(), "Salary cannot be null");
        assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("required")),
                "Should have validation error for required salary");
    }

    /**
     * Test: Employee salary must be positive
     */
    @Test
    @DisplayName("Employee salary must be positive")
    void testEmployeeSalaryMustBePositive() {
        validEmployee.setSalary(BigDecimal.valueOf(-1000.00));
        Set<ConstraintViolation<Employee>> violations = validator.validate(validEmployee);
        assertFalse(violations.isEmpty(), "Negative salary should fail validation");
        assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("positive")),
                "Should have validation error for negative salary");
    }

    /**
     * Test: Employee salary cannot be zero
     */
    @Test
    @DisplayName("Employee salary cannot be zero")
    void testEmployeeSalaryCannotBeZero() {
        validEmployee.setSalary(BigDecimal.ZERO);
        Set<ConstraintViolation<Employee>> violations = validator.validate(validEmployee);
        assertFalse(violations.isEmpty(), "Zero salary should fail validation");
        assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("positive")),
                "Should have validation error for zero salary");
    }

    /**
     * Test: Employee salary with valid decimal values
     */
    @Test
    @DisplayName("Employee salary with valid decimal values")
    void testEmployeeSalaryWithValidDecimals() {
        validEmployee.setSalary(BigDecimal.valueOf(50000.99));
        Set<ConstraintViolation<Employee>> violations = validator.validate(validEmployee);
        assertTrue(violations.isEmpty(), "Valid salary with decimals should pass validation");
    }

    /**
     * Test: onCreate callback sets createdAt and updatedAt
     */
    @Test
    @DisplayName("onCreate callback sets timestamps")
    void testOnCreateCallbackSetsTimestamps() {
        Employee employee = Employee.builder()
                .name("Jane Smith")
                .email("jane.smith@bank.com")
                .department("HR")
                .salary(BigDecimal.valueOf(65000.00))
                .build();

        employee.onCreate();

        assertNotNull(employee.getCreatedAt(), "createdAt should be set");
        assertNotNull(employee.getUpdatedAt(), "updatedAt should be set");
        assertEquals(employee.getCreatedAt(), employee.getUpdatedAt(),
                "createdAt and updatedAt should be equal on creation");
    }

    /**
     * Test: onUpdate callback updates updatedAt
     */
    @Test
    @DisplayName("onUpdate callback updates timestamp")
    void testOnUpdateCallbackUpdatesTimestamp() {
        LocalDateTime originalUpdatedAt = validEmployee.getUpdatedAt();

        try {
            Thread.sleep(100); // Small delay to ensure timestamp is different
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        validEmployee.onUpdate();

        assertTrue(validEmployee.getUpdatedAt().isAfter(originalUpdatedAt),
                "updatedAt should be updated to a later time");
    }

    /**
     * Test: Employee builder creates valid employee
     */
    @Test
    @DisplayName("Employee builder creates valid instance")
    void testEmployeeBuilderCreatesValidInstance() {
        Employee employee = Employee.builder()
                .id(2L)
                .name("Test Employee")
                .email("test@example.com")
                .department("IT")
                .salary(BigDecimal.valueOf(80000.00))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        assertNotNull(employee);
        assertEquals(2L, employee.getId());
        assertEquals("Test Employee", employee.getName());
        assertEquals("test@example.com", employee.getEmail());
        assertEquals("IT", employee.getDepartment());
        assertEquals(BigDecimal.valueOf(80000.00), employee.getSalary());
    }

    /**
     * Test: Employee toString returns proper format
     */
    @Test
    @DisplayName("Employee toString returns proper format")
    void testEmployeeToStringFormat() {
        String toString = validEmployee.toString();
        assertTrue(toString.contains("Employee{"));
        assertTrue(toString.contains("id="));
        assertTrue(toString.contains("name="));
        assertTrue(toString.contains("email="));
        assertTrue(toString.contains("department="));
        assertTrue(toString.contains("salary="));
    }

    /**
     * Test: Employee with maximum length strings
     */
    @Test
    @DisplayName("Employee accepts maximum length strings")
    void testEmployeeWithMaximumLengthStrings() {
        String maxString = "a".repeat(255);
        validEmployee.setName(maxString);
        validEmployee.setEmail("a@" + maxString.substring(0, 250) + ".com");
        validEmployee.setDepartment(maxString);

        Set<ConstraintViolation<Employee>> violations = validator.validate(validEmployee);
        // Note: Email might fail due to format, but name and department should pass length validation
        assertEquals(1, violations.size(), "Only email format violation expected");
    }

    /**
     * Test: Employee with minimum valid salary
     */
    @Test
    @DisplayName("Employee with minimum valid salary")
    void testEmployeeWithMinimumValidSalary() {
        validEmployee.setSalary(BigDecimal.valueOf(0.01));
        Set<ConstraintViolation<Employee>> violations = validator.validate(validEmployee);
        assertTrue(violations.isEmpty(), "Minimum valid salary (0.01) should pass validation");
    }

}
