package com.empman.controller;

import com.empman.dto.ApiResponse;
import com.empman.dto.EmployeeDTO;
import com.empman.service.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Employee Controller
 * 
 * REST API endpoints for employee management.
 * Handles HTTP requests and delegates to EmployeeService for business logic.
 * 
 * Base URL: /api/employees
 * 
 * Endpoints:
 * - POST /api/employees - Create new employee (201 Created)
 * - GET /api/employees - List all employees (200 OK)
 * - GET /api/employees/{id} - Get employee by ID (200 OK or 404 Not Found)
 * - PUT /api/employees/{id} - Update employee (200 OK or 404 Not Found)
 * - DELETE /api/employees/{id} - Delete employee (204 No Content or 404 Not Found)
 * - GET /api/employees/search - Search employees by name (200 OK)
 * 
 * All requests and responses use JSON format.
 * Input validation is enforced using @Valid annotation.
 * Errors are handled by GlobalExceptionHandler and returned as ApiResponse.
 * 
 * @since 1.0.0
 */
@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    /**
     * Create a new employee.
     * 
     * HTTP Method: POST
     * Endpoint: /api/employees
     * 
     * Request Body: EmployeeDTO with fields (name, email, department, salary)
     * Response: 201 Created with created employee data
     * 
     * Example:
     * POST /api/employees
     * {
     *   "name": "John Doe",
     *   "email": "john.doe@bank.com",
     *   "department": "Finance",
     *   "salary": 75000.00
     * }
     * 
     * Response (201):
     * {
     *   "success": true,
     *   "data": {
     *     "id": 1,
     *     "name": "John Doe",
     *     "email": "john.doe@bank.com",
     *     "department": "Finance",
     *     "salary": 75000.00,
     *     "createdAt": "2026-08-11T10:30:00",
     *     "updatedAt": "2026-08-11T10:30:00"
     *   },
     *   "message": "Employee created successfully",
     *   "timestamp": "2026-08-11T10:30:00"
     * }
     * 
     * @param employeeDTO the employee data (validated)
     * @return ResponseEntity with 201 status and created employee
     */
    @PostMapping
    public ResponseEntity<ApiResponse<EmployeeDTO>> createEmployee(
            @Valid @RequestBody EmployeeDTO employeeDTO) {

        EmployeeDTO created = employeeService.createEmployee(employeeDTO);
        ApiResponse<EmployeeDTO> response = ApiResponse.success(created, "Employee created successfully");

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get all employees.
     * 
     * HTTP Method: GET
     * Endpoint: /api/employees
     * 
     * Query Parameters: None
     * Response: 200 OK with list of all employees
     * 
     * Example:
     * GET /api/employees
     * 
     * Response (200):
     * {
     *   "success": true,
     *   "data": [
     *     {
     *       "id": 1,
     *       "name": "John Doe",
     *       "email": "john.doe@bank.com",
     *       "department": "Finance",
     *       "salary": 75000.00,
     *       "createdAt": "2026-08-11T10:30:00",
     *       "updatedAt": "2026-08-11T10:30:00"
     *     }
     *   ],
     *   "message": "Employees retrieved successfully",
     *   "timestamp": "2026-08-11T10:30:00"
     * }
     * 
     * @return ResponseEntity with 200 status and list of employees
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<EmployeeDTO>>> getAllEmployees() {
        List<EmployeeDTO> employees = employeeService.getAllEmployees();
        ApiResponse<List<EmployeeDTO>> response = ApiResponse.success(
                employees,
                "Employees retrieved successfully");

        return ResponseEntity.ok(response);
    }

    /**
     * Get employee by ID.
     * 
     * HTTP Method: GET
     * Endpoint: /api/employees/{id}
     * 
     * Path Parameter: id - Employee ID (required)
     * Response: 200 OK with employee data, or 404 Not Found
     * 
     * Example:
     * GET /api/employees/1
     * 
     * Response (200):
     * {
     *   "success": true,
     *   "data": {
     *     "id": 1,
     *     "name": "John Doe",
     *     "email": "john.doe@bank.com",
     *     "department": "Finance",
     *     "salary": 75000.00,
     *     "createdAt": "2026-08-11T10:30:00",
     *     "updatedAt": "2026-08-11T10:30:00"
     *   },
     *   "message": "Employee retrieved successfully",
     *   "timestamp": "2026-08-11T10:30:00"
     * }
     * 
     * Response (404):
     * {
     *   "success": false,
     *   "data": null,
     *   "message": "Employee with ID 999 not found",
     *   "timestamp": "2026-08-11T10:30:00"
     * }
     * 
     * @param id the employee ID
     * @return ResponseEntity with 200 status and employee data, or 404 Not Found
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeDTO>> getEmployeeById(
            @PathVariable Long id) {

        EmployeeDTO employee = employeeService.getEmployeeById(id);
        ApiResponse<EmployeeDTO> response = ApiResponse.success(employee, "Employee retrieved successfully");

        return ResponseEntity.ok(response);
    }

    /**
     * Update an existing employee.
     * 
     * HTTP Method: PUT
     * Endpoint: /api/employees/{id}
     * 
     * Path Parameter: id - Employee ID (required)
     * Request Body: EmployeeDTO with updated fields
     * Response: 200 OK with updated employee data, or 404 Not Found
     * 
     * Example:
     * PUT /api/employees/1
     * {
     *   "name": "Jane Doe",
     *   "email": "jane.doe@bank.com",
     *   "department": "Legal",
     *   "salary": 90000.00
     * }
     * 
     * Response (200):
     * {
     *   "success": true,
     *   "data": {
     *     "id": 1,
     *     "name": "Jane Doe",
     *     "email": "jane.doe@bank.com",
     *     "department": "Legal",
     *     "salary": 90000.00,
     *     "createdAt": "2026-08-11T10:30:00",
     *     "updatedAt": "2026-08-11T10:45:00"
     *   },
     *   "message": "Employee updated successfully",
     *   "timestamp": "2026-08-11T10:45:00"
     * }
     * 
     * Response (404):
     * {
     *   "success": false,
     *   "data": null,
     *   "message": "Employee with ID 999 not found",
     *   "timestamp": "2026-08-11T10:45:00"
     * }
     * 
     * @param id the employee ID
     * @param employeeDTO the updated employee data (validated)
     * @return ResponseEntity with 200 status and updated employee, or 404 Not Found
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeDTO>> updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeDTO employeeDTO) {

        EmployeeDTO updated = employeeService.updateEmployee(id, employeeDTO);
        ApiResponse<EmployeeDTO> response = ApiResponse.success(updated, "Employee updated successfully");

        return ResponseEntity.ok(response);
    }

    /**
     * Delete an employee.
     * 
     * HTTP Method: DELETE
     * Endpoint: /api/employees/{id}
     * 
     * Path Parameter: id - Employee ID (required)
     * Response: 204 No Content on success, or 404 Not Found
     * 
     * Example:
     * DELETE /api/employees/1
     * 
     * Response (204):
     * (Empty body with HTTP 204 status)
     * 
     * Response (404):
     * {
     *   "success": false,
     *   "data": null,
     *   "message": "Employee with ID 999 not found",
     *   "timestamp": "2026-08-11T10:45:00"
     * }
     * 
     * @param id the employee ID
     * @return ResponseEntity with 204 No Content on success, or 404 Not Found
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Search employees by name (case-insensitive).
     * 
     * HTTP Method: GET
     * Endpoint: /api/employees/search
     * 
     * Query Parameter: name - Search term (required)
     * Response: 200 OK with list of matching employees
     * 
     * Note: This endpoint MUST come after /{id} to avoid route conflicts.
     * 
     * Example:
     * GET /api/employees/search?name=John
     * 
     * Response (200):
     * {
     *   "success": true,
     *   "data": [
     *     {
     *       "id": 1,
     *       "name": "John Doe",
     *       "email": "john.doe@bank.com",
     *       "department": "Finance",
     *       "salary": 75000.00,
     *       "createdAt": "2026-08-11T10:30:00",
     *       "updatedAt": "2026-08-11T10:30:00"
     *     }
     *   ],
     *   "message": "Search results retrieved successfully",
     *   "timestamp": "2026-08-11T10:45:00"
     * }
     * 
     * Response (200 - No matches):
     * {
     *   "success": true,
     *   "data": [],
     *   "message": "Search results retrieved successfully",
     *   "timestamp": "2026-08-11T10:45:00"
     * }
     * 
     * @param name the search term
     * @return ResponseEntity with 200 status and list of matching employees
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<EmployeeDTO>>> searchEmployees(
            @RequestParam String name) {

        List<EmployeeDTO> results = employeeService.searchEmployeesByName(name);
        ApiResponse<List<EmployeeDTO>> response = ApiResponse.success(
                results,
                "Search results retrieved successfully");

        return ResponseEntity.ok(response);
    }

}
