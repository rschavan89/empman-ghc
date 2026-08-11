package com.empman.repository;

import com.empman.entity.Employee;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Integration Tests for EmployeeRepository
 * 
 * Tests CRUD operations and custom query methods.
 * Uses Spring Data JPA test configuration with H2 in-memory database.
 * 
 * Test Coverage:
 * - Create (save) employee
 * - Read (findById, findAll) employees
 * - Update employee
 * - Delete employee
 * - Search (findByNameContainingIgnoreCase) employees
 * 
 * @since 1.0.0
 */
@DataJpaTest
@DisplayName("Employee Repository Tests")
class EmployeeRepositoryTest {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private TestEntityManager testEntityManager;

    private Employee employee1;
    private Employee employee2;
    private Employee employee3;

    /**
     * Setup: Create test employees before each test
     */
    @BeforeEach
    void setUp() {
        employee1 = Employee.builder()
                .name("John Doe")
                .email("john.doe@bank.com")
                .department("Finance")
                .salary(BigDecimal.valueOf(75000.00))
                .build();

        employee2 = Employee.builder()
                .name("Jane Smith")
                .email("jane.smith@bank.com")
                .department("HR")
                .salary(BigDecimal.valueOf(65000.00))
                .build();

        employee3 = Employee.builder()
                .name("john Johnson")
                .email("john.johnson@bank.com")
                .department("IT")
                .salary(BigDecimal.valueOf(85000.00))
                .build();
    }

    /**
     * Test: Create (save) a new employee
     */
    @Test
    @DisplayName("Should create a new employee")
    void testCreateEmployee() {
        Employee saved = employeeRepository.save(employee1);

        assertNotNull(saved.getId(), "Employee ID should be auto-generated");
        assertNotNull(saved.getCreatedAt(), "CreatedAt should be set");
        assertNotNull(saved.getUpdatedAt(), "UpdatedAt should be set");
        assertEquals("John Doe", saved.getName());
        assertEquals("john.doe@bank.com", saved.getEmail());
    }

    /**
     * Test: Read (findById) an existing employee
     */
    @Test
    @DisplayName("Should find employee by ID")
    void testFindEmployeeById() {
        Employee saved = employeeRepository.save(employee1);
        testEntityManager.flush();

        Optional<Employee> found = employeeRepository.findById(saved.getId());

        assertTrue(found.isPresent(), "Employee should be found by ID");
        assertEquals(saved.getId(), found.get().getId());
        assertEquals("John Doe", found.get().getName());
    }

    /**
     * Test: Read non-existent employee by ID returns empty Optional
     */
    @Test
    @DisplayName("Should return empty Optional for non-existent employee ID")
    void testFindByIdNonExistent() {
        Optional<Employee> found = employeeRepository.findById(999L);

        assertFalse(found.isPresent(), "Non-existent employee should return empty Optional");
    }

    /**
     * Test: Read all employees
     */
    @Test
    @DisplayName("Should retrieve all employees")
    void testFindAllEmployees() {
        employeeRepository.save(employee1);
        employeeRepository.save(employee2);
        employeeRepository.save(employee3);
        testEntityManager.flush();

        List<Employee> all = employeeRepository.findAll();

        assertEquals(3, all.size(), "Should find 3 employees");
    }

    /**
     * Test: Read all employees when database is empty
     */
    @Test
    @DisplayName("Should return empty list when no employees exist")
    void testFindAllEmployeesEmpty() {
        List<Employee> all = employeeRepository.findAll();

        assertTrue(all.isEmpty(), "Should return empty list when no employees exist");
    }

    /**
     * Test: Update an existing employee
     */
    @Test
    @DisplayName("Should update employee details")
    void testUpdateEmployee() {
        Employee saved = employeeRepository.save(employee1);
        LocalDateTime originalCreatedAt = saved.getCreatedAt();

        try {
            Thread.sleep(100); // Small delay to ensure timestamp difference
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        saved.setDepartment("Legal");
        saved.setSalary(BigDecimal.valueOf(90000.00));
        Employee updated = employeeRepository.save(saved);

        assertEquals(originalCreatedAt, updated.getCreatedAt(), "CreatedAt should not change");
        assertTrue(updated.getUpdatedAt().isAfter(originalCreatedAt), "UpdatedAt should be newer");
        assertEquals("Legal", updated.getDepartment());
        assertEquals(BigDecimal.valueOf(90000.00), updated.getSalary());
    }

    /**
     * Test: Delete an existing employee
     */
    @Test
    @DisplayName("Should delete an employee")
    void testDeleteEmployee() {
        Employee saved = employeeRepository.save(employee1);
        Long employeeId = saved.getId();
        testEntityManager.flush();

        employeeRepository.deleteById(employeeId);
        testEntityManager.flush();

        Optional<Employee> found = employeeRepository.findById(employeeId);
        assertFalse(found.isPresent(), "Employee should be deleted");
    }

    /**
     * Test: Delete employee by entity
     */
    @Test
    @DisplayName("Should delete employee by entity reference")
    void testDeleteEmployeeByEntity() {
        Employee saved = employeeRepository.save(employee1);
        Long employeeId = saved.getId();
        testEntityManager.flush();

        employeeRepository.delete(saved);
        testEntityManager.flush();

        Optional<Employee> found = employeeRepository.findById(employeeId);
        assertFalse(found.isPresent(), "Employee should be deleted");
    }

    /**
     * Test: Search employees by name (case-sensitive search term, case-insensitive DB search)
     */
    @Test
    @DisplayName("Should search employees by name case-insensitive")
    void testSearchByNameCaseInsensitive() {
        employeeRepository.save(employee1);
        employeeRepository.save(employee2);
        employeeRepository.save(employee3);
        testEntityManager.flush();

        List<Employee> results = employeeRepository.findByNameContainingIgnoreCase("john");

        assertEquals(2, results.size(), "Should find 2 employees with 'john' in name");
        assertTrue(results.stream().anyMatch(e -> e.getName().equals("John Doe")));
        assertTrue(results.stream().anyMatch(e -> e.getName().equals("john Johnson")));
    }

    /**
     * Test: Search employees by name with uppercase letters
     */
    @Test
    @DisplayName("Should search by name with uppercase letters")
    void testSearchByNameUppercase() {
        employeeRepository.save(employee1);
        employeeRepository.save(employee2);
        testEntityManager.flush();

        List<Employee> results = employeeRepository.findByNameContainingIgnoreCase("JOHN");

        assertEquals(1, results.size(), "Should find 1 employee with 'john' in name");
        assertEquals("John Doe", results.get(0).getName());
    }

    /**
     * Test: Search employees by partial name
     */
    @Test
    @DisplayName("Should find employees by partial name match")
    void testSearchByPartialName() {
        employeeRepository.save(employee1);
        employeeRepository.save(employee2);
        employeeRepository.save(employee3);
        testEntityManager.flush();

        List<Employee> results = employeeRepository.findByNameContainingIgnoreCase("Smith");

        assertEquals(1, results.size(), "Should find employee with partial name match");
        assertEquals("Jane Smith", results.get(0).getName());
    }

    /**
     * Test: Search returns empty list for no matches
     */
    @Test
    @DisplayName("Should return empty list when no name matches")
    void testSearchByNameNoMatches() {
        employeeRepository.save(employee1);
        employeeRepository.save(employee2);
        testEntityManager.flush();

        List<Employee> results = employeeRepository.findByNameContainingIgnoreCase("NonExistent");

        assertTrue(results.isEmpty(), "Should return empty list when no employees match");
    }

    /**
     * Test: Check if employee exists by ID
     */
    @Test
    @DisplayName("Should check if employee exists")
    void testEmployeeExists() {
        Employee saved = employeeRepository.save(employee1);
        testEntityManager.flush();

        assertTrue(employeeRepository.existsById(saved.getId()), "Employee should exist");
        assertFalse(employeeRepository.existsById(999L), "Non-existent employee should not exist");
    }

    /**
     * Test: Count employees
     */
    @Test
    @DisplayName("Should count employees in database")
    void testCountEmployees() {
        employeeRepository.save(employee1);
        employeeRepository.save(employee2);
        employeeRepository.save(employee3);
        testEntityManager.flush();

        long count = employeeRepository.count();

        assertEquals(3L, count, "Should count 3 employees");
    }

    /**
     * Test: Unique email constraint (database level)
     * Note: This test verifies that duplicate emails are prevented.
     */
    @Test
    @DisplayName("Should reject duplicate email addresses")
    void testUniqueEmailConstraint() {
        Employee emp1 = Employee.builder()
                .name("Employee One")
                .email("duplicate@bank.com")
                .department("Finance")
                .salary(BigDecimal.valueOf(50000.00))
                .build();

        Employee emp2 = Employee.builder()
                .name("Employee Two")
                .email("duplicate@bank.com")  // Same email as emp1
                .department("HR")
                .salary(BigDecimal.valueOf(60000.00))
                .build();

        employeeRepository.save(emp1);
        testEntityManager.flush();

        assertThrows(Exception.class, () -> {
            employeeRepository.save(emp2);
            testEntityManager.flush();
        }, "Should throw exception for duplicate email");
    }

}
