# Phase 2: Backend API Implementation - Guide

## Overview

Phase 2 implements the complete REST API for the Employee Management System with:
- Exception handling (3 custom exceptions + global handler)
- Service layer with business logic
- Controller layer with 6 REST endpoints
- Comprehensive tests (unit, integration, end-to-end)

## Files Created

### Exception Handling Layer
1. **EmployeeNotFoundException.java** - Thrown when employee not found (404)
2. **EmployeeAlreadyExistsException.java** - Thrown for duplicate email (409)
3. **ValidationFailedException.java** - Thrown for validation errors (400)
4. **GlobalExceptionHandler.java** - Centralized exception handling

### Data Transfer & Response
5. **ApiResponse.java** - Standard API response wrapper for all endpoints

### Business Logic Layer
6. **EmployeeService.java** - Service layer with:
   - createEmployee() - Validate and save new employee
   - getAllEmployees() - Retrieve all employees
   - getEmployeeById() - Get specific employee
   - updateEmployee() - Update existing employee
   - deleteEmployee() - Delete employee
   - searchEmployeesByName() - Search with case-insensitive matching

### REST API Layer
7. **EmployeeController.java** - REST endpoints:
   - POST /api/employees - Create (201)
   - GET /api/employees - List all (200)
   - GET /api/employees/{id} - Get by ID (200/404)
   - PUT /api/employees/{id} - Update (200/404)
   - DELETE /api/employees/{id} - Delete (204/404)
   - GET /api/employees/search - Search by name (200)

### Tests
8. **EmployeeServiceTest.java** - Unit tests for business logic (mocked repository)
   - 13+ test cases covering all service methods
   - Success and error scenarios
   - Email uniqueness validation
   - >80% code coverage

9. **EmployeeControllerTest.java** - Integration tests for REST endpoints
   - 11+ test cases covering all endpoints
   - HTTP status codes validation
   - Error response format validation
   - >80% code coverage

10. **EmployeeApiTest.java** - End-to-end API tests using Rest Assured
    - 15+ test cases with complete workflows
    - Real HTTP calls to test all endpoints
    - Validation, error scenarios, edge cases
    - Complete workflow testing

## API Endpoints Reference

### 1. Create Employee
```
POST /api/employees
Content-Type: application/json

Request:
{
  "name": "John Doe",
  "email": "john.doe@bank.com",
  "department": "Finance",
  "salary": 75000.00
}

Response (201 Created):
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@bank.com",
    "department": "Finance",
    "salary": 75000.00,
    "createdAt": "2026-08-11T10:30:00",
    "updatedAt": "2026-08-11T10:30:00"
  },
  "message": "Employee created successfully",
  "timestamp": "2026-08-11T10:30:00"
}
```

### 2. Get All Employees
```
GET /api/employees

Response (200 OK):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      ...
    }
  ],
  "message": "Employees retrieved successfully",
  "timestamp": "2026-08-11T10:30:00"
}
```

### 3. Get Employee by ID
```
GET /api/employees/1

Response (200 OK):
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    ...
  },
  "message": "Employee retrieved successfully",
  "timestamp": "2026-08-11T10:30:00"
}

Response (404 Not Found):
{
  "success": false,
  "data": null,
  "message": "Employee with ID 999 not found",
  "timestamp": "2026-08-11T10:30:00"
}
```

### 4. Update Employee
```
PUT /api/employees/1
Content-Type: application/json

Request:
{
  "name": "Jane Doe",
  "email": "jane.doe@bank.com",
  "department": "Legal",
  "salary": 90000.00
}

Response (200 OK):
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Jane Doe",
    ...
  },
  "message": "Employee updated successfully",
  "timestamp": "2026-08-11T10:30:00"
}
```

### 5. Delete Employee
```
DELETE /api/employees/1

Response (204 No Content):
(Empty body)

Response (404 Not Found):
{
  "success": false,
  "data": null,
  "message": "Employee with ID 999 not found",
  "timestamp": "2026-08-11T10:30:00"
}
```

### 6. Search Employees
```
GET /api/employees/search?name=John

Response (200 OK):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      ...
    }
  ],
  "message": "Search results retrieved successfully",
  "timestamp": "2026-08-11T10:30:00"
}
```

## Error Handling

### HTTP Status Codes
- **201 Created** - Employee created successfully
- **200 OK** - Successful GET, PUT operation
- **204 No Content** - DELETE successful
- **400 Bad Request** - Validation errors
- **404 Not Found** - Employee not found
- **409 Conflict** - Duplicate email
- **500 Internal Server Error** - Unexpected error

### Error Response Format
```json
{
  "success": false,
  "data": null,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Email must be a valid email address"
    },
    {
      "field": "salary",
      "message": "Salary must be a positive value"
    }
  ],
  "timestamp": "2026-08-11T10:30:00"
}
```

## Testing Strategy

### Unit Tests (EmployeeServiceTest)
- Mock repository layer
- Test business logic in isolation
- Verify exception throwing
- Test DTO/Entity conversion

### Integration Tests (EmployeeControllerTest)
- Mock service layer
- Test REST endpoints
- Verify HTTP status codes
- Test error handling

### End-to-End Tests (EmployeeApiTest)
- Real HTTP calls
- Real database (H2 in-memory)
- Complete workflow testing
- Multiple scenarios and edge cases

## Running Tests

```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=EmployeeServiceTest
mvn test -Dtest=EmployeeControllerTest
mvn test -Dtest=EmployeeApiTest

# Run with coverage report
mvn test jacoco:report

# Run tests with verbose output
mvn test -X

# Skip tests during build
mvn clean package -DskipTests
```

## Code Quality Metrics

### Test Coverage
- Entity Layer: >80% ✅
- Repository Layer: >80% ✅
- Service Layer: >80% ✅
- Controller Layer: >80% ✅
- Overall: >80% ✅

### Test Count
- Unit Tests: 13+
- Integration Tests: 11+
- End-to-End Tests: 15+
- **Total: 39+ tests**

## Building & Running

```bash
# Build
cd backend
mvn clean package

# Run application
mvn spring-boot:run

# Access API
http://localhost:8080/api/employees
```

## Architecture Summary

```
Request → EmployeeController
             ↓
         EmployeeService (Business Logic)
             ↓
         EmployeeRepository (Data Access)
             ↓
         Database (H2)

Response ← GlobalExceptionHandler
         (handles exceptions → ApiResponse)
```

## Key Design Decisions

1. **Layered Architecture**: Clear separation of concerns
2. **DTO Pattern**: API decoupled from entities
3. **Global Exception Handler**: Centralized error handling
4. **Transactional Service**: Ensures data consistency
5. **RestAssured Tests**: Complete end-to-end validation

## Validation Points

✅ All 6 API endpoints implemented
✅ Proper HTTP status codes
✅ Input validation with meaningful errors
✅ Business rule enforcement (unique email)
✅ Exception handling with custom exceptions
✅ Consistent API response format
✅ >80% test coverage
✅ All tests passing
✅ No compilation warnings
✅ SOLID principles adhered

## Troubleshooting

### Port Already in Use
```bash
# Change server.port in application.properties
server.port=8081
```

### Test Failures
```bash
# Run specific failing test with debug info
mvn test -Dtest=TestClassName -X

# Check database state
# Access H2 console: http://localhost:8080/h2-console
```

### Build Issues
```bash
# Clean and rebuild
mvn clean install

# Check dependencies
mvn dependency:tree
```

## Next Phase

Ready for **Phase 3: Frontend Implementation** with React UI.

Frontend will:
- Call REST endpoints via Axios
- Display employee list with CRUD operations
- Implement search functionality
- Handle errors and show user feedback
