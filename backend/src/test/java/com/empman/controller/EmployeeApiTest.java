package com.empman.controller;

import com.empman.dto.EmployeeDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;

import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

/**
 * End-to-End API Tests using Rest Assured
 * 
 * Integration tests for all REST API endpoints.
 * Tests complete workflows with actual HTTP calls.
 * Uses H2 in-memory database for testing.
 * 
 * Test Coverage:
 * - Create employee
 * - Get all employees
 * - Get employee by ID
 * - Update employee
 * - Delete employee
 * - Search employees
 * - Error scenarios (validation, not found, conflicts)
 * 
 * @since 1.0.0
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DisplayName("Employee API Integration Tests")
class EmployeeApiTest {

    @LocalServerPort
    private int port;

    @Autowired
    private ObjectMapper objectMapper;

    private String baseUrl;
    private Long createdEmployeeId;

    /**
     * Setup: Initialize RestAssured and test data
     */
    @BeforeEach
    void setUp() {
        RestAssured.port = port;
        baseUrl = "http://localhost:" + port + "/api/employees";
    }

    /**
     * Test: Create employee endpoint (POST)
     */
    @Test
    @DisplayName("POST /api/employees - Create employee")
    void testCreateEmployee() {
        EmployeeDTO employee = EmployeeDTO.builder()
                .name("John Doe")
                .email("john.doe@bank.com")
                .department("Finance")
                .salary(BigDecimal.valueOf(75000.00))
                .build();

        createdEmployeeId = given()
                .baseUri(baseUrl)
                .contentType(ContentType.JSON)
                .body(employee)
                .when()
                .post()
                .then()
                .statusCode(201)
                .body("success", equalTo(true))
                .body("data.name", equalTo("John Doe"))
                .body("data.email", equalTo("john.doe@bank.com"))
                .body("data.department", equalTo("Finance"))
                .body("data.salary", equalTo(75000.00F))
                .body("message", equalTo("Employee created successfully"))
                .extract()
                .path("data.id");

        System.out.println("Created Employee ID: " + createdEmployeeId);
    }

    /**
     * Test: Get all employees endpoint (GET)
     */
    @Test
    @DisplayName("GET /api/employees - Retrieve all employees")
    void testGetAllEmployees() {
        // First create an employee
        EmployeeDTO employee = EmployeeDTO.builder()
                .name("Jane Smith")
                .email("jane.smith@bank.com")
                .department("HR")
                .salary(BigDecimal.valueOf(65000.00))
                .build();

        given()
                .baseUri(baseUrl)
                .contentType(ContentType.JSON)
                .body(employee)
                .when()
                .post()
                .then()
                .statusCode(201);

        // Get all employees
        given()
                .baseUri(baseUrl)
                .when()
                .get()
                .then()
                .statusCode(200)
                .body("success", equalTo(true))
                .body("data", notNullValue())
                .body("data", instanceOf(java.util.List.class))
                .body("message", equalTo("Employees retrieved successfully"));
    }

    /**
     * Test: Get employee by ID endpoint (GET)
     */
    @Test
    @DisplayName("GET /api/employees/{id} - Retrieve employee by ID")
    void testGetEmployeeById() {
        // First create an employee
        EmployeeDTO employee = EmployeeDTO.builder()
                .name("Bob Wilson")
                .email("bob.wilson@bank.com")
                .department("IT")
                .salary(BigDecimal.valueOf(85000.00))
                .build();

        Long employeeId = given()
                .baseUri(baseUrl)
                .contentType(ContentType.JSON)
                .body(employee)
                .when()
                .post()
                .then()
                .statusCode(201)
                .extract()
                .path("data.id");

        // Get employee by ID
        given()
                .baseUri(baseUrl)
                .when()
                .get("/" + employeeId)
                .then()
                .statusCode(200)
                .body("success", equalTo(true))
                .body("data.id", equalTo(employeeId.intValue()))
                .body("data.name", equalTo("Bob Wilson"))
                .body("message", equalTo("Employee retrieved successfully"));
    }

    /**
     * Test: Get non-existent employee by ID returns 404
     */
    @Test
    @DisplayName("GET /api/employees/{id} - Non-existent ID returns 404")
    void testGetEmployeeByIdNotFound() {
        given()
                .baseUri(baseUrl)
                .when()
                .get("/999999")
                .then()
                .statusCode(404)
                .body("success", equalTo(false))
                .body("message", containsString("not found"));
    }

    /**
     * Test: Update employee endpoint (PUT)
     */
    @Test
    @DisplayName("PUT /api/employees/{id} - Update employee")
    void testUpdateEmployee() {
        // First create an employee
        EmployeeDTO employee = EmployeeDTO.builder()
                .name("Alice Johnson")
                .email("alice.johnson@bank.com")
                .department("Finance")
                .salary(BigDecimal.valueOf(75000.00))
                .build();

        Long employeeId = given()
                .baseUri(baseUrl)
                .contentType(ContentType.JSON)
                .body(employee)
                .when()
                .post()
                .then()
                .statusCode(201)
                .extract()
                .path("data.id");

        // Update the employee
        EmployeeDTO updateDTO = EmployeeDTO.builder()
                .name("Alice Updated")
                .email("alice.updated@bank.com")
                .department("Legal")
                .salary(BigDecimal.valueOf(90000.00))
                .build();

        given()
                .baseUri(baseUrl)
                .contentType(ContentType.JSON)
                .body(updateDTO)
                .when()
                .put("/" + employeeId)
                .then()
                .statusCode(200)
                .body("success", equalTo(true))
                .body("data.name", equalTo("Alice Updated"))
                .body("data.department", equalTo("Legal"))
                .body("data.salary", equalTo(90000.00F))
                .body("message", equalTo("Employee updated successfully"));
    }

    /**
     * Test: Delete employee endpoint (DELETE)
     */
    @Test
    @DisplayName("DELETE /api/employees/{id} - Delete employee")
    void testDeleteEmployee() {
        // First create an employee
        EmployeeDTO employee = EmployeeDTO.builder()
                .name("Charlie Brown")
                .email("charlie.brown@bank.com")
                .department("Finance")
                .salary(BigDecimal.valueOf(70000.00))
                .build();

        Long employeeId = given()
                .baseUri(baseUrl)
                .contentType(ContentType.JSON)
                .body(employee)
                .when()
                .post()
                .then()
                .statusCode(201)
                .extract()
                .path("data.id");

        // Delete the employee
        given()
                .baseUri(baseUrl)
                .when()
                .delete("/" + employeeId)
                .then()
                .statusCode(204);

        // Verify employee is deleted
        given()
                .baseUri(baseUrl)
                .when()
                .get("/" + employeeId)
                .then()
                .statusCode(404);
    }

    /**
     * Test: Delete non-existent employee returns 404
     */
    @Test
    @DisplayName("DELETE /api/employees/{id} - Non-existent ID returns 404")
    void testDeleteEmployeeNotFound() {
        given()
                .baseUri(baseUrl)
                .when()
                .delete("/999999")
                .then()
                .statusCode(404)
                .body("success", equalTo(false));
    }

    /**
     * Test: Search employees by name endpoint (GET)
     */
    @Test
    @DisplayName("GET /api/employees/search - Search by name")
    void testSearchEmployees() {
        // Create multiple employees with similar names
        EmployeeDTO employee1 = EmployeeDTO.builder()
                .name("John Doe")
                .email("john.doe@bank.com")
                .department("Finance")
                .salary(BigDecimal.valueOf(75000.00))
                .build();

        EmployeeDTO employee2 = EmployeeDTO.builder()
                .name("john Smith")
                .email("john.smith@bank.com")
                .department("HR")
                .salary(BigDecimal.valueOf(65000.00))
                .build();

        given()
                .baseUri(baseUrl)
                .contentType(ContentType.JSON)
                .body(employee1)
                .when()
                .post()
                .then()
                .statusCode(201);

        given()
                .baseUri(baseUrl)
                .contentType(ContentType.JSON)
                .body(employee2)
                .when()
                .post()
                .then()
                .statusCode(201);

        // Search for employees with "John" in name
        given()
                .baseUri(baseUrl)
                .param("name", "John")
                .when()
                .get("/search")
                .then()
                .statusCode(200)
                .body("success", equalTo(true))
                .body("data", notNullValue())
                .body("data.size()", greaterThanOrEqualTo(2))
                .body("message", equalTo("Search results retrieved successfully"));
    }

    /**
     * Test: Search with no matches returns empty list
     */
    @Test
    @DisplayName("GET /api/employees/search - No matches returns empty list")
    void testSearchEmployeesNoMatches() {
        given()
                .baseUri(baseUrl)
                .param("name", "NonExistentEmployee12345")
                .when()
                .get("/search")
                .then()
                .statusCode(200)
                .body("success", equalTo(true))
                .body("data", hasSize(0));
    }

    /**
     * Test: Create employee with duplicate email returns 409
     */
    @Test
    @DisplayName("POST /api/employees - Duplicate email returns 409 Conflict")
    void testCreateEmployeeDuplicateEmail() {
        EmployeeDTO employee1 = EmployeeDTO.builder()
                .name("Employee One")
                .email("duplicate@bank.com")
                .department("Finance")
                .salary(BigDecimal.valueOf(75000.00))
                .build();

        EmployeeDTO employee2 = EmployeeDTO.builder()
                .name("Employee Two")
                .email("duplicate@bank.com")
                .department("HR")
                .salary(BigDecimal.valueOf(65000.00))
                .build();

        // Create first employee
        given()
                .baseUri(baseUrl)
                .contentType(ContentType.JSON)
                .body(employee1)
                .when()
                .post()
                .then()
                .statusCode(201);

        // Try to create second employee with same email
        given()
                .baseUri(baseUrl)
                .contentType(ContentType.JSON)
                .body(employee2)
                .when()
                .post()
                .then()
                .statusCode(409)
                .body("success", equalTo(false))
                .body("message", containsString("already exists"));
    }

    /**
     * Test: Create employee with invalid email returns 400
     */
    @Test
    @DisplayName("POST /api/employees - Invalid email returns 400 Bad Request")
    void testCreateEmployeeInvalidEmail() {
        EmployeeDTO employee = EmployeeDTO.builder()
                .name("Invalid Email")
                .email("not-an-email")  // Invalid email format
                .department("Finance")
                .salary(BigDecimal.valueOf(75000.00))
                .build();

        given()
                .baseUri(baseUrl)
                .contentType(ContentType.JSON)
                .body(employee)
                .when()
                .post()
                .then()
                .statusCode(400)
                .body("success", equalTo(false))
                .body("errors", notNullValue());
    }

    /**
     * Test: Create employee with negative salary returns 400
     */
    @Test
    @DisplayName("POST /api/employees - Negative salary returns 400 Bad Request")
    void testCreateEmployeeNegativeSalary() {
        EmployeeDTO employee = EmployeeDTO.builder()
                .name("Negative Salary")
                .email("negative@bank.com")
                .department("Finance")
                .salary(BigDecimal.valueOf(-50000.00))  // Negative salary
                .build();

        given()
                .baseUri(baseUrl)
                .contentType(ContentType.JSON)
                .body(employee)
                .when()
                .post()
                .then()
                .statusCode(400)
                .body("success", equalTo(false));
    }

    /**
     * Test: Create employee with missing required fields returns 400
     */
    @Test
    @DisplayName("POST /api/employees - Missing required field returns 400 Bad Request")
    void testCreateEmployeeMissingField() {
        String invalidJson = "{ \"name\": \"Missing Email\", \"department\": \"Finance\" }";

        given()
                .baseUri(baseUrl)
                .contentType(ContentType.JSON)
                .body(invalidJson)
                .when()
                .post()
                .then()
                .statusCode(400)
                .body("success", equalTo(false));
    }

    /**
     * Test: Complete workflow (Create → Get → Update → Delete)
     */
    @Test
    @DisplayName("Complete workflow - Create, Get, Update, Delete")
    void testCompleteWorkflow() {
        // 1. Create employee
        EmployeeDTO employee = EmployeeDTO.builder()
                .name("Workflow Test")
                .email("workflow@bank.com")
                .department("Finance")
                .salary(BigDecimal.valueOf(75000.00))
                .build();

        Long employeeId = given()
                .baseUri(baseUrl)
                .contentType(ContentType.JSON)
                .body(employee)
                .when()
                .post()
                .then()
                .statusCode(201)
                .body("success", equalTo(true))
                .extract()
                .path("data.id");

        // 2. Get the created employee
        given()
                .baseUri(baseUrl)
                .when()
                .get("/" + employeeId)
                .then()
                .statusCode(200)
                .body("success", equalTo(true))
                .body("data.name", equalTo("Workflow Test"));

        // 3. Update the employee
        EmployeeDTO updateDTO = EmployeeDTO.builder()
                .name("Workflow Updated")
                .email("workflow.updated@bank.com")
                .department("Legal")
                .salary(BigDecimal.valueOf(95000.00))
                .build();

        given()
                .baseUri(baseUrl)
                .contentType(ContentType.JSON)
                .body(updateDTO)
                .when()
                .put("/" + employeeId)
                .then()
                .statusCode(200)
                .body("success", equalTo(true))
                .body("data.department", equalTo("Legal"));

        // 4. Delete the employee
        given()
                .baseUri(baseUrl)
                .when()
                .delete("/" + employeeId)
                .then()
                .statusCode(204);

        // 5. Verify employee is deleted
        given()
                .baseUri(baseUrl)
                .when()
                .get("/" + employeeId)
                .then()
                .statusCode(404);
    }

}
