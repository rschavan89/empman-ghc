# Employee Manager - Architecture

## System Overview

The Employee Management System is built using a three-tier architecture:
- **Presentation Layer**: React frontend UI
- **Application Layer**: Spring Boot REST API
- **Data Layer**: H2 Database with JPA/Hibernate ORM

```
┌─────────────────────────────────────┐
│      React Frontend (UI Layer)      │
│  ├─ Components                      │
│  ├─ Pages                           │
│  └─ Services (API Calls)            │
└──────────────┬──────────────────────┘
               │ HTTP/REST
┌──────────────▼──────────────────────┐
│   Spring Boot Backend (API Layer)   │
│  ├─ Controllers                     │
│  ├─ Services                        │
│  ├─ Repositories                    │
│  └─ Models/Entities                 │
└──────────────┬──────────────────────┘
               │ JDBC/Hibernate
┌──────────────▼──────────────────────┐
│       H2 Database                   │
│  ├─ Employee Table                  │
│  └─ Indexes                         │
└─────────────────────────────────────┘
```

## Backend Architecture (Spring Boot)

### 1. Controller Layer
**Responsibility**: Handle HTTP requests and responses

```
EmployeeController
├─ POST   /api/employees          → Create employee
├─ GET    /api/employees          → List all employees
├─ GET    /api/employees/{id}     → Get employee by ID
├─ PUT    /api/employees/{id}     → Update employee
├─ DELETE /api/employees/{id}     → Delete employee
└─ GET    /api/employees/search   → Search by name
```

**Components**:
- `EmployeeController`: REST endpoint handler
- Input validation using annotations (@Valid, @NotNull, etc.)
- Exception handling with global @ControllerAdvice

### 2. Service Layer
**Responsibility**: Business logic and data processing

**Components**:
- `EmployeeService`: Main business logic
  - `addEmployee(EmployeeDTO)` → Employee
  - `getAllEmployees()` → List<Employee>
  - `getEmployeeById(Long)` → Employee
  - `updateEmployee(Long, EmployeeDTO)` → Employee
  - `deleteEmployee(Long)` → void
  - `searchByName(String)` → List<Employee>

**Logic**:
- Field validation
- Business rule enforcement
- Data transformation (Entity ↔ DTO)
- Transaction management

### 3. Repository Layer
**Responsibility**: Data access and persistence

**Components**:
- `EmployeeRepository extends JpaRepository<Employee, Long>`
  - Inherits standard CRUD operations
  - Custom query: `findByNameContainingIgnoreCase(String name)`

**Operations**:
- CRUD operations on Employee entity
- Database query execution
- Transaction boundaries

### 4. Entity/Model Layer
**Responsibility**: Data representation

**Components**:
- `Employee` (JPA Entity)
  ```
  - id: Long (Primary Key, Auto-generated)
  - name: String (Not Null)
  - email: String (Not Null, Unique)
  - department: String (Not Null)
  - salary: BigDecimal (Not Null)
  - createdAt: LocalDateTime
  - updatedAt: LocalDateTime
  ```

- `EmployeeDTO` (Data Transfer Object)
  - Used for API requests/responses
  - Includes validation annotations

### 5. Exception Handling

**Global Exception Handler**:
- `GlobalExceptionHandler`
  - `ResourceNotFoundException` → 404
  - `ValidationException` → 400
  - `DatabaseException` → 500
  - Generic `Exception` → 500

**Custom Exceptions**:
- `EmployeeNotFoundException`: When employee ID not found
- `EmployeeAlreadyExistsException`: When email already exists
- `ValidationFailedException`: Field validation failures

## Frontend Architecture (React)

### 1. Component Structure

```
App
├─ Layout
│  ├─ Header
│  └─ Navigation
├─ Pages
│  ├─ EmployeeListPage
│  ├─ AddEmployeePage
│  ├─ EditEmployeePage
│  └─ EmployeeDetailPage
└─ Components
   ├─ EmployeeForm
   ├─ EmployeeList
   ├─ EmployeeCard
   ├─ SearchBar
   ├─ ConfirmDialog
   └─ ErrorAlert
```

### 2. Services/API Layer

**EmployeeService** (API communication):
- `getEmployees()` → Promise<Employee[]>
- `getEmployeeById(id)` → Promise<Employee>
- `createEmployee(employee)` → Promise<Employee>
- `updateEmployee(id, employee)` → Promise<Employee>
- `deleteEmployee(id)` → Promise<void>
- `searchEmployees(name)` → Promise<Employee[]>

**State Management**:
- React Hooks (useState, useEffect, useContext)
- Context API for global state (if needed)
- Local component state for forms

### 3. Key Components

| Component | Purpose |
|-----------|---------|
| EmployeeListPage | Display all employees with search |
| EmployeeForm | Reusable form for add/edit |
| EmployeeCard | Individual employee display |
| SearchBar | Search functionality |
| ConfirmDialog | Confirmation for delete |
| ErrorAlert | Error message display |

## Data Flow

### Add Employee Flow
```
1. User fills form in AddEmployeePage
2. EmployeeForm validates input
3. EmployeeService.createEmployee() calls backend
4. EmployeeController receives POST /api/employees
5. EmployeeService validates business rules
6. EmployeeRepository saves to database
7. Response returned to frontend
8. UI updates EmployeeListPage
```

### Update Employee Flow
```
1. User edits employee on EditEmployeePage
2. EmployeeForm pre-populates existing data
3. User submits changes
4. EmployeeService.updateEmployee() calls backend
5. EmployeeController receives PUT /api/employees/{id}
6. EmployeeService validates and updates
7. EmployeeRepository saves changes
8. Response returned to frontend
9. UI navigates to detail or list page
```

### Delete Employee Flow
```
1. User clicks delete button
2. ConfirmDialog appears
3. On confirmation, EmployeeService.deleteEmployee() calls backend
4. EmployeeController receives DELETE /api/employees/{id}
5. EmployeeService performs deletion
6. EmployeeRepository removes from database
7. Response returned to frontend
8. UI removes from list and shows success message
```

### Search Employee Flow
```
1. User enters search term in SearchBar
2. EmployeeService.searchEmployees(name) calls backend
3. EmployeeController receives GET /api/employees/search?name=...
4. EmployeeRepository.findByNameContainingIgnoreCase() executes
5. Results returned to frontend
6. EmployeeListPage updates with search results
```

## Design Patterns

### 1. Controller/Service/Repository Pattern
- Separation of concerns
- Testability
- Reusability

### 2. DTO Pattern
- Decouples API contract from entity model
- Validates input at API boundary
- Protects internal representation

### 3. Global Exception Handler
- Centralized error handling
- Consistent API error responses
- No exception leakage to frontend

### 4. Dependency Injection (Spring)
- Loose coupling
- Easier testing with mocks
- Configuration management

### 5. React Components as Pure Functions
- Predictable rendering
- Easier testing
- Reusability

## API Contract

### Response Structure
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2026-08-11T10:30:00Z"
}
```

### Employee Response
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@bank.com",
  "department": "Finance",
  "salary": 75000.00,
  "createdAt": "2026-08-11T10:00:00Z",
  "updatedAt": "2026-08-11T10:00:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "data": null,
  "message": "Employee not found",
  "errors": [
    {
      "field": "id",
      "message": "Employee with ID 999 does not exist"
    }
  ],
  "timestamp": "2026-08-11T10:30:00Z"
}
```

## Database Schema

```sql
CREATE TABLE employee (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  department VARCHAR(255) NOT NULL,
  salary DECIMAL(19, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_name ON employee(name);
CREATE INDEX idx_email ON employee(email);
```

## Technology Decisions

| Decision | Rationale |
|----------|-----------|
| Spring Boot | Rapid development, built-in features, convention over configuration |
| JPA/Hibernate | ORM reduces boilerplate, automatic schema management |
| H2 | In-memory database for development, no external dependency |
| React | Component-based, reactive updates, large ecosystem |
| REST API | Stateless, scalable, standard HTTP operations |
| DTO Pattern | API versioning flexibility, security |

## Scalability Considerations

1. **Database**: Add connection pooling, caching layer (Redis)
2. **Backend**: Horizontal scaling with load balancer
3. **Frontend**: CDN for static assets, lazy loading
4. **Search**: Full-text search with Elasticsearch for large datasets

## Security Considerations

1. **Input Validation**: Sanitize all user inputs
2. **Email Validation**: Ensure valid email format
3. **Salary Validation**: Accept only positive decimals
4. **CORS**: Configure appropriate CORS policies
5. **SQL Injection Prevention**: Use parameterized queries (JPA handles this)
6. **XSS Prevention**: React's default escaping + CSP headers

## Deployment Architecture

- **Backend**: Spring Boot JAR (deployable to cloud/on-premise)
- **Frontend**: React build artifacts (static hosting)
- **Database**: H2 embedded or standalone server
- **Docker Support**: Containerization for consistency

## Approved Architecture Constraints

This architecture adheres to:
- ✅ SOLID Principles
- ✅ DRY (Don't Repeat Yourself)
- ✅ Clean Code Standards
- ✅ Separation of Concerns
- ✅ REST Principles
