package com.empman.service;

import com.empman.dto.EmployeeDTO;
import com.empman.entity.Employee;
import com.empman.exception.EmployeeAlreadyExistsException;
import com.empman.exception.EmployeeNotFoundException;
import com.empman.repository.EmployeeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

/**
 * Unit Tests for EmployeeService
 * 
 * Tests business logic layer with mocked repository.
 * Verifies all CRUD operations and error handling.
 * 
 * Test Coverage:
 * - Create employee (success and duplicate email scenarios)
 * - Get all employees
 * - Get employee by ID (success and not found)
 * - Update employee (success, not found, duplicate email)
 * - Delete employee (success and not found)
 * - Search employees by name
 * - DTO/Entity conversion
 * 
 * @since 1.0.0
 */
@DisplayName("Employee Service Tests")
class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private EmployeeService employeeService;

    private Employee testEmployee;
    private EmployeeDTO testEmployeeDTO;

    /**
     * Setup: Initialize mocks and test data
     */
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        testEmployee = Employee.builder()
                .id(1L)
                .name("John Doe")
                .email("john.doe@bank.com")
                .department("Finance")
                .salary(BigDecimal.valueOf(75000.00))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        testEmployeeDTO = EmployeeDTO.builder()
                .name("John Doe")
                .email("john.doe@bank.com")
                .department("Finance")
                .salary(BigDecimal.valueOf(75000.00))
                .build();
    }

    /**
     * Test: Create employee successfully
     */
    @Test
    @DisplayName("Should create employee successfully")
    void testCreateEmployeeSuccess() {
        when(employeeRepository.findAll()).thenReturn(Arrays.asList());
        when(employeeRepository.save(any(Employee.class))).thenReturn(testEmployee);

        EmployeeDTO result = employeeService.createEmployee(testEmployeeDTO);

        assertNotNull(result);
        assertEquals("John Doe", result.getName());
        assertEquals("john.doe@bank.com", result.getEmail());
        verify(employeeRepository, times(1)).save(any(Employee.class));
    }

    /**
     * Test: Create employee with duplicate email throws exception
     */
    @Test
    @DisplayName("Should throw exception when email already exists")
    void testCreateEmployeeDuplicateEmail() {
        when(employeeRepository.findAll()).thenReturn(Arrays.asList(testEmployee));

        assertThrows(EmployeeAlreadyExistsException.class, () -> {
            employeeService.createEmployee(testEmployeeDTO);
        });

        verify(employeeRepository, never()).save(any(Employee.class));
    }

    /**
     * Test: Get all employees
     */
    @Test
    @DisplayName("Should get all employees")
    void testGetAllEmployees() {
        Employee employee2 = Employee.builder()
                .id(2L)
                .name("Jane Smith")
                .email("jane.smith@bank.com")
                .department("HR")
                .salary(BigDecimal.valueOf(65000.00))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        when(employeeRepository.findAll()).thenReturn(Arrays.asList(testEmployee, employee2));

        List<EmployeeDTO> result = employeeService.getAllEmployees();

        assertEquals(2, result.size());
        assertEquals("John Doe", result.get(0).getName());
        assertEquals("Jane Smith", result.get(1).getName());
        verify(employeeRepository, times(1)).findAll();
    }

    /**
     * Test: Get employee by ID successfully
     */
    @Test
    @DisplayName("Should get employee by ID")
    void testGetEmployeeByIdSuccess() {
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(testEmployee));

        EmployeeDTO result = employeeService.getEmployeeById(1L);

        assertNotNull(result);
        assertEquals("John Doe", result.getName());
        assertEquals(1L, result.getId());
        verify(employeeRepository, times(1)).findById(1L);
    }

    /**
     * Test: Get employee by ID throws exception when not found
     */
    @Test
    @DisplayName("Should throw exception when employee not found by ID")
    void testGetEmployeeByIdNotFound() {
        when(employeeRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(EmployeeNotFoundException.class, () -> {
            employeeService.getEmployeeById(999L);
        });

        verify(employeeRepository, times(1)).findById(999L);
    }

    /**
     * Test: Update employee successfully
     */
    @Test
    @DisplayName("Should update employee successfully")
    void testUpdateEmployeeSuccess() {
        EmployeeDTO updateDTO = EmployeeDTO.builder()
                .name("John Updated")
                .email("john.updated@bank.com")
                .department("Legal")
                .salary(BigDecimal.valueOf(90000.00))
                .build();

        when(employeeRepository.findById(1L)).thenReturn(Optional.of(testEmployee));
        when(employeeRepository.findAll()).thenReturn(Arrays.asList(testEmployee));
        when(employeeRepository.save(any(Employee.class))).thenReturn(testEmployee);

        EmployeeDTO result = employeeService.updateEmployee(1L, updateDTO);

        assertNotNull(result);
        verify(employeeRepository, times(1)).findById(1L);
        verify(employeeRepository, times(1)).save(any(Employee.class));
    }

    /**
     * Test: Update employee throws exception when not found
     */
    @Test
    @DisplayName("Should throw exception when updating non-existent employee")
    void testUpdateEmployeeNotFound() {
        when(employeeRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(EmployeeNotFoundException.class, () -> {
            employeeService.updateEmployee(999L, testEmployeeDTO);
        });

        verify(employeeRepository, never()).save(any(Employee.class));
    }

    /**
     * Test: Update employee throws exception for duplicate email
     */
    @Test
    @DisplayName("Should throw exception when updating to duplicate email")
    void testUpdateEmployeeDuplicateEmail() {
        Employee anotherEmployee = Employee.builder()
                .id(2L)
                .name("Another Employee")
                .email("another@bank.com")
                .department("HR")
                .salary(BigDecimal.valueOf(65000.00))
                .build();

        EmployeeDTO updateDTO = EmployeeDTO.builder()
                .name("John Doe")
                .email("another@bank.com") // Email of another employee
                .department("Finance")
                .salary(BigDecimal.valueOf(75000.00))
                .build();

        when(employeeRepository.findById(1L)).thenReturn(Optional.of(testEmployee));
        when(employeeRepository.findAll()).thenReturn(Arrays.asList(testEmployee, anotherEmployee));

        assertThrows(EmployeeAlreadyExistsException.class, () -> {
            employeeService.updateEmployee(1L, updateDTO);
        });

        verify(employeeRepository, never()).save(any(Employee.class));
    }

    /**
     * Test: Delete employee successfully
     */
    @Test
    @DisplayName("Should delete employee successfully")
    void testDeleteEmployeeSuccess() {
        when(employeeRepository.existsById(1L)).thenReturn(true);

        employeeService.deleteEmployee(1L);

        verify(employeeRepository, times(1)).deleteById(1L);
    }

    /**
     * Test: Delete employee throws exception when not found
     */
    @Test
    @DisplayName("Should throw exception when deleting non-existent employee")
    void testDeleteEmployeeNotFound() {
        when(employeeRepository.existsById(999L)).thenReturn(false);

        assertThrows(EmployeeNotFoundException.class, () -> {
            employeeService.deleteEmployee(999L);
        });

        verify(employeeRepository, never()).deleteById(anyLong());
    }

    /**
     * Test: Search employees by name
     */
    @Test
    @DisplayName("Should search employees by name")
    void testSearchEmployeesByName() {
        Employee employee2 = Employee.builder()
                .id(2L)
                .name("john Smith")
                .email("john.smith@bank.com")
                .department("HR")
                .salary(BigDecimal.valueOf(65000.00))
                .build();

        when(employeeRepository.findByNameContainingIgnoreCase("John")).thenReturn(
                Arrays.asList(testEmployee, employee2));

        List<EmployeeDTO> result = employeeService.searchEmployeesByName("John");

        assertEquals(2, result.size());
        assertEquals("John Doe", result.get(0).getName());
        assertEquals("john Smith", result.get(1).getName());
        verify(employeeRepository, times(1)).findByNameContainingIgnoreCase("John");
    }

    /**
     * Test: Search returns empty list when no matches
     */
    @Test
    @DisplayName("Should return empty list for no search matches")
    void testSearchEmployeesNoMatches() {
        when(employeeRepository.findByNameContainingIgnoreCase("NonExistent")).thenReturn(
                Arrays.asList());

        List<EmployeeDTO> result = employeeService.searchEmployeesByName("NonExistent");

        assertTrue(result.isEmpty());
        verify(employeeRepository, times(1)).findByNameContainingIgnoreCase("NonExistent");
    }

}
