package com.empman.service;

import com.empman.dto.EmployeeDTO;
import com.empman.entity.Employee;
import com.empman.exception.EmployeeAlreadyExistsException;
import com.empman.exception.EmployeeNotFoundException;
import com.empman.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Employee Service
 * 
 * Business logic layer for employee operations.
 * Handles CRUD operations and search with validation and error handling.
 * 
 * Responsibilities:
 * - Validate employee data
 * - Check business rule constraints (e.g., unique email)
 * - Perform CRUD operations
 * - Handle exceptions and return meaningful errors
 * - Transform between Entity and DTO
 * 
 * All methods are transactional to ensure data consistency.
 * 
 * @since 1.0.0
 */
@Service
@RequiredArgsConstructor
@Transactional
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    /**
     * Create a new employee.
     * 
     * Validates that:
     * - Email is not already in use
     * - All required fields are present (validated by @Valid annotation)
     * - Salary is positive (validated by annotation)
     * 
     * @param employeeDTO the employee data
     * @return the created employee DTO
     * @throws EmployeeAlreadyExistsException if email already exists
     */
    public EmployeeDTO createEmployee(EmployeeDTO employeeDTO) {
        // Check if email already exists
        Optional<Employee> existing = employeeRepository.findAll().stream()
                .filter(e -> e.getEmail().equalsIgnoreCase(employeeDTO.getEmail()))
                .findFirst();

        if (existing.isPresent()) {
            throw new EmployeeAlreadyExistsException(
                    "Employee with email '" + employeeDTO.getEmail() + "' already exists");
        }

        // Convert DTO to Entity
        Employee employee = dtoToEntity(employeeDTO);

        // Save to database
        Employee saved = employeeRepository.save(employee);

        // Convert back to DTO and return
        return entityToDto(saved);
    }

    /**
     * Get all employees.
     * 
     * @return list of all employee DTOs
     */
    @Transactional(readOnly = true)
    public List<EmployeeDTO> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(this::entityToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get employee by ID.
     * 
     * @param id the employee ID
     * @return the employee DTO
     * @throws EmployeeNotFoundException if employee not found
     */
    @Transactional(readOnly = true)
    public EmployeeDTO getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException(
                        "Employee with ID " + id + " not found"));

        return entityToDto(employee);
    }

    /**
     * Update an existing employee.
     * 
     * Validates that:
     * - Employee with given ID exists
     * - New email is not already in use by another employee (if changed)
     * - All required fields are present (validated by @Valid annotation)
     * 
     * @param id the employee ID
     * @param employeeDTO the updated employee data
     * @return the updated employee DTO
     * @throws EmployeeNotFoundException if employee not found
     * @throws EmployeeAlreadyExistsException if new email already exists
     */
    public EmployeeDTO updateEmployee(Long id, EmployeeDTO employeeDTO) {
        // Verify employee exists
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException(
                        "Employee with ID " + id + " not found"));

        // Check if email is being changed and if new email already exists
        if (!employee.getEmail().equalsIgnoreCase(employeeDTO.getEmail())) {
            Optional<Employee> existing = employeeRepository.findAll().stream()
                    .filter(e -> e.getEmail().equalsIgnoreCase(employeeDTO.getEmail()))
                    .filter(e -> !e.getId().equals(id)) // Exclude current employee
                    .findFirst();

            if (existing.isPresent()) {
                throw new EmployeeAlreadyExistsException(
                        "Employee with email '" + employeeDTO.getEmail() + "' already exists");
            }
        }

        // Update fields
        employee.setName(employeeDTO.getName());
        employee.setEmail(employeeDTO.getEmail());
        employee.setDepartment(employeeDTO.getDepartment());
        employee.setSalary(employeeDTO.getSalary());

        // Save updated employee
        Employee updated = employeeRepository.save(employee);

        // Convert to DTO and return
        return entityToDto(updated);
    }

    /**
     * Delete an employee by ID.
     * 
     * @param id the employee ID
     * @throws EmployeeNotFoundException if employee not found
     */
    public void deleteEmployee(Long id) {
        // Verify employee exists
        if (!employeeRepository.existsById(id)) {
            throw new EmployeeNotFoundException(
                    "Employee with ID " + id + " not found");
        }

        // Delete the employee
        employeeRepository.deleteById(id);
    }

    /**
     * Search for employees by name (case-insensitive).
     * 
     * @param name the search term
     * @return list of matching employee DTOs
     */
    @Transactional(readOnly = true)
    public List<EmployeeDTO> searchEmployeesByName(String name) {
        return employeeRepository.findByNameContainingIgnoreCase(name).stream()
                .map(this::entityToDto)
                .collect(Collectors.toList());
    }

    /**
     * Convert Employee entity to EmployeeDTO.
     * 
     * @param employee the entity
     * @return the DTO
     */
    private EmployeeDTO entityToDto(Employee employee) {
        return EmployeeDTO.builder()
                .id(employee.getId())
                .name(employee.getName())
                .email(employee.getEmail())
                .department(employee.getDepartment())
                .salary(employee.getSalary())
                .createdAt(employee.getCreatedAt())
                .updatedAt(employee.getUpdatedAt())
                .build();
    }

    /**
     * Convert EmployeeDTO to Employee entity.
     * 
     * @param dto the DTO
     * @return the entity
     */
    private Employee dtoToEntity(EmployeeDTO dto) {
        return Employee.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .department(dto.getDepartment())
                .salary(dto.getSalary())
                .build();
    }

}
