package com.empman.controller;

import com.empman.dto.EmployeeDTO;
import com.empman.exception.EmployeeAlreadyExistsException;
import com.empman.exception.EmployeeNotFoundException;
import com.empman.service.EmployeeService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration Tests for EmployeeController
 * 
 * Tests REST API endpoints with mocked EmployeeService.
 * Verifies HTTP requests/responses and status codes.
 * 
 * Test Coverage:
 * - POST /api/employees (create)
 * - GET /api/employees (list all)
 * - GET /api/employees/{id} (get by ID)
 * - PUT /api/employees/{id} (update)
 * - DELETE /api/employees/{id} (delete)
 * - GET /api/employees/search (search by name)
 * 
 * @since 1.0.0
 */
@WebMvcTest(EmployeeController.class)
@DisplayName("Employee Controller Tests")
class EmployeeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EmployeeService employeeService;

    @Autowired
    private ObjectMapper objectMapper;

    private EmployeeDTO testEmployeeDTO;
    private EmployeeDTO createdEmployeeDTO;

    /**
     * Setup: Initialize test data
     */
    @BeforeEach
    void setUp() {
        testEmployeeDTO = EmployeeDTO.builder()
                .name("John Doe")
                .email("john.doe@bank.com")
                .department("Finance")
                .salary(BigDecimal.valueOf(75000.00))
                .build();

        createdEmployeeDTO = EmployeeDTO.builder()
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
     * Test: Create employee returns 201 Created
     */
    @Test
    @DisplayName("POST /api/employees - Create employee successfully")
    void testCreateEmployeeSuccess() throws Exception {
        when(employeeService.createEmployee(any(EmployeeDTO.class))).thenReturn(createdEmployeeDTO);

        mockMvc.perform(post("/api/employees")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testEmployeeDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.id", is(1)))
                .andExpect(jsonPath("$.data.name", is("John Doe")))
                .andExpect(jsonPath("$.message", is("Employee created successfully")));

        verify(employeeService, times(1)).createEmployee(any(EmployeeDTO.class));
    }

    /**
     * Test: Create employee with duplicate email returns 409 Conflict
     */
    @Test
    @DisplayName("POST /api/employees - Duplicate email returns 409 Conflict")
    void testCreateEmployeeDuplicateEmail() throws Exception {
        when(employeeService.createEmployee(any(EmployeeDTO.class)))
                .thenThrow(new EmployeeAlreadyExistsException("Employee with email already exists"));

        mockMvc.perform(post("/api/employees")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testEmployeeDTO)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", is("Employee with email already exists")));
    }

    /**
     * Test: Create employee with invalid input returns 400 Bad Request
     */
    @Test
    @DisplayName("POST /api/employees - Invalid input returns 400 Bad Request")
    void testCreateEmployeeInvalidInput() throws Exception {
        EmployeeDTO invalidDTO = EmployeeDTO.builder()
                .name("")  // Empty name
                .email("invalid-email")  // Invalid email format
                .department("Finance")
                .salary(BigDecimal.valueOf(-1000.00))  // Negative salary
                .build();

        mockMvc.perform(post("/api/employees")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success", is(false)));
    }

    /**
     * Test: Get all employees returns 200 OK
     */
    @Test
    @DisplayName("GET /api/employees - Get all employees successfully")
    void testGetAllEmployeesSuccess() throws Exception {
        EmployeeDTO employee2 = EmployeeDTO.builder()
                .id(2L)
                .name("Jane Smith")
                .email("jane.smith@bank.com")
                .department("HR")
                .salary(BigDecimal.valueOf(65000.00))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        List<EmployeeDTO> employees = Arrays.asList(createdEmployeeDTO, employee2);
        when(employeeService.getAllEmployees()).thenReturn(employees);

        mockMvc.perform(get("/api/employees"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(2)))
                .andExpect(jsonPath("$.data[0].name", is("John Doe")))
                .andExpect(jsonPath("$.data[1].name", is("Jane Smith")))
                .andExpect(jsonPath("$.message", is("Employees retrieved successfully")));

        verify(employeeService, times(1)).getAllEmployees();
    }

    /**
     * Test: Get employee by ID returns 200 OK
     */
    @Test
    @DisplayName("GET /api/employees/{id} - Get employee by ID successfully")
    void testGetEmployeeByIdSuccess() throws Exception {
        when(employeeService.getEmployeeById(1L)).thenReturn(createdEmployeeDTO);

        mockMvc.perform(get("/api/employees/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.id", is(1)))
                .andExpect(jsonPath("$.data.name", is("John Doe")))
                .andExpect(jsonPath("$.message", is("Employee retrieved successfully")));

        verify(employeeService, times(1)).getEmployeeById(1L);
    }

    /**
     * Test: Get employee by non-existent ID returns 404 Not Found
     */
    @Test
    @DisplayName("GET /api/employees/{id} - Non-existent ID returns 404 Not Found")
    void testGetEmployeeByIdNotFound() throws Exception {
        when(employeeService.getEmployeeById(999L))
                .thenThrow(new EmployeeNotFoundException("Employee with ID 999 not found"));

        mockMvc.perform(get("/api/employees/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", is("Employee with ID 999 not found")));
    }

    /**
     * Test: Update employee returns 200 OK
     */
    @Test
    @DisplayName("PUT /api/employees/{id} - Update employee successfully")
    void testUpdateEmployeeSuccess() throws Exception {
        EmployeeDTO updateDTO = EmployeeDTO.builder()
                .name("John Updated")
                .email("john.updated@bank.com")
                .department("Legal")
                .salary(BigDecimal.valueOf(90000.00))
                .build();

        EmployeeDTO updatedDTO = EmployeeDTO.builder()
                .id(1L)
                .name("John Updated")
                .email("john.updated@bank.com")
                .department("Legal")
                .salary(BigDecimal.valueOf(90000.00))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        when(employeeService.updateEmployee(1L, updateDTO)).thenReturn(updatedDTO);

        mockMvc.perform(put("/api/employees/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.name", is("John Updated")))
                .andExpect(jsonPath("$.data.department", is("Legal")))
                .andExpect(jsonPath("$.message", is("Employee updated successfully")));

        verify(employeeService, times(1)).updateEmployee(anyLong(), any(EmployeeDTO.class));
    }

    /**
     * Test: Update non-existent employee returns 404 Not Found
     */
    @Test
    @DisplayName("PUT /api/employees/{id} - Non-existent ID returns 404 Not Found")
    void testUpdateEmployeeNotFound() throws Exception {
        when(employeeService.updateEmployee(999L, testEmployeeDTO))
                .thenThrow(new EmployeeNotFoundException("Employee with ID 999 not found"));

        mockMvc.perform(put("/api/employees/999")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testEmployeeDTO)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success", is(false)));
    }

    /**
     * Test: Delete employee returns 204 No Content
     */
    @Test
    @DisplayName("DELETE /api/employees/{id} - Delete employee successfully")
    void testDeleteEmployeeSuccess() throws Exception {
        doNothing().when(employeeService).deleteEmployee(1L);

        mockMvc.perform(delete("/api/employees/1"))
                .andExpect(status().isNoContent());

        verify(employeeService, times(1)).deleteEmployee(1L);
    }

    /**
     * Test: Delete non-existent employee returns 404 Not Found
     */
    @Test
    @DisplayName("DELETE /api/employees/{id} - Non-existent ID returns 404 Not Found")
    void testDeleteEmployeeNotFound() throws Exception {
        doThrow(new EmployeeNotFoundException("Employee with ID 999 not found"))
                .when(employeeService).deleteEmployee(999L);

        mockMvc.perform(delete("/api/employees/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success", is(false)));
    }

    /**
     * Test: Search employees by name returns 200 OK
     */
    @Test
    @DisplayName("GET /api/employees/search - Search by name successfully")
    void testSearchEmployeesSuccess() throws Exception {
        EmployeeDTO employee2 = EmployeeDTO.builder()
                .id(2L)
                .name("john Smith")
                .email("john.smith@bank.com")
                .department("HR")
                .salary(BigDecimal.valueOf(65000.00))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        List<EmployeeDTO> results = Arrays.asList(createdEmployeeDTO, employee2);
        when(employeeService.searchEmployeesByName("John")).thenReturn(results);

        mockMvc.perform(get("/api/employees/search")
                .param("name", "John"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(2)))
                .andExpect(jsonPath("$.message", is("Search results retrieved successfully")));

        verify(employeeService, times(1)).searchEmployeesByName("John");
    }

    /**
     * Test: Search with no matches returns 200 OK with empty list
     */
    @Test
    @DisplayName("GET /api/employees/search - No matches returns empty list")
    void testSearchEmployeesNoMatches() throws Exception {
        when(employeeService.searchEmployeesByName("NonExistent")).thenReturn(Arrays.asList());

        mockMvc.perform(get("/api/employees/search")
                .param("name", "NonExistent"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(0)));

        verify(employeeService, times(1)).searchEmployeesByName("NonExistent");
    }

}
