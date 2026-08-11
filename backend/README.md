# Employee Manager - Backend

Spring Boot REST API for Employee Management System

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/empman/
│   │   │   ├── entity/              # JPA Entities
│   │   │   ├── repository/          # Spring Data JPA Repositories
│   │   │   ├── dto/                 # Data Transfer Objects
│   │   │   ├── service/             # Business Logic Services
│   │   │   ├── controller/          # REST Controllers
│   │   │   ├── exception/           # Custom Exceptions
│   │   │   └── EmployeeManagerApplication.java  # Main Application
│   │   └── resources/
│   │       └── application.properties  # Spring Boot Configuration
│   └── test/
│       └── java/com/empman/         # Unit & Integration Tests
└── pom.xml                          # Maven Configuration
```

## Technology Stack

- **Framework**: Spring Boot 3.1.4
- **Language**: Java 17
- **Database**: H2 (in-memory for development)
- **ORM**: Hibernate/JPA
- **Build Tool**: Maven
- **Testing**: JUnit 5, Spring Boot Test, Rest Assured

## Prerequisites

- Java 17 or higher
- Maven 3.6.0 or higher

## Building the Project

### Build JAR
```bash
cd backend
mvn clean package
```

### Build without running tests
```bash
mvn clean package -DskipTests
```

### Build with detailed output
```bash
mvn clean package -X
```

## Running the Application

### Run using Maven
```bash
mvn spring-boot:run
```

### Run the JAR file
```bash
java -jar target/employee-manager-1.0.0.jar
```

### Access the Application
- **REST API**: http://localhost:8080
- **H2 Console**: http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:empmandb`
  - Username: `sa`
  - Password: (leave empty)

## Testing

### Run all tests
```bash
mvn test
```

### Run specific test class
```bash
mvn test -Dtest=EmployeeTest
```

### Run tests with coverage report
```bash
mvn test jacoco:report
```

Coverage report available at: `target/site/jacoco/index.html`

### Run with Maven Surefire plugin
```bash
mvn surefire:test
```

## REST API Endpoints

Base URL: `http://localhost:8080/api/employees`

### 1. Create Employee
```
POST /api/employees
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@bank.com",
  "department": "Finance",
  "salary": 75000.00
}

Response: 201 Created
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@bank.com",
  "department": "Finance",
  "salary": 75000.00,
  "createdAt": "2026-08-11T10:30:00",
  "updatedAt": "2026-08-11T10:30:00"
}
```

### 2. Get All Employees
```
GET /api/employees

Response: 200 OK
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@bank.com",
    "department": "Finance",
    "salary": 75000.00,
    "createdAt": "2026-08-11T10:30:00",
    "updatedAt": "2026-08-11T10:30:00"
  }
]
```

### 3. Get Employee by ID
```
GET /api/employees/1

Response: 200 OK
{
  "id": 1,
  "name": "John Doe",
  ...
}

Response: 404 Not Found (if employee doesn't exist)
```

### 4. Update Employee
```
PUT /api/employees/1
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@bank.com",
  "department": "Legal",
  "salary": 90000.00
}

Response: 200 OK
```

### 5. Delete Employee
```
DELETE /api/employees/1

Response: 204 No Content
```

### 6. Search Employees by Name
```
GET /api/employees/search?name=John

Response: 200 OK
[
  {
    "id": 1,
    "name": "John Doe",
    ...
  }
]
```

## Code Quality

### SOLID Principles Applied
- **Single Responsibility**: Each class has one reason to change
- **Open/Closed**: Services are open for extension, closed for modification
- **Liskov Substitution**: Repository pattern allows proper substitution
- **Interface Segregation**: Focused interfaces for each layer
- **Dependency Inversion**: Depends on abstractions (interfaces)

### Clean Code Practices
- Clear naming conventions
- Small, focused methods
- Proper error handling
- Comprehensive documentation
- DRY principle applied

### Design Patterns Used
- **MVC**: Controller, Service, Repository layers
- **DTO**: Data Transfer Objects for API contracts
- **Repository**: Abstract data access layer
- **Global Exception Handler**: Centralized error handling
- **Dependency Injection**: Spring's IoC container

## Database Configuration

### H2 In-Memory Database
- Auto-starts when Spring Boot application starts
- Schema auto-created from JPA entities
- Data persists in memory during runtime
- Cleared on application restart

### Console Configuration
- Enabled by default for development
- Access at `http://localhost:8080/h2-console`
- Not recommended for production

## Troubleshooting

### Build Issues
```bash
# Clean Maven cache
mvn clean

# Rebuild
mvn install

# Check dependencies
mvn dependency:tree
```

### Database Connection Issues
- Ensure H2 is on classpath (configured in pom.xml)
- Check application.properties JDBC URL
- Verify database driver

### Port Already in Use
```bash
# Change port in application.properties
server.port=8081

# Or kill process using port 8080
lsof -i :8080
kill -9 <PID>
```

### Test Failures
```bash
# Run tests with debug output
mvn test -X

# Run specific test
mvn test -Dtest=EmployeeRepositoryTest
```

## Development Workflow

1. **Create Entity** → Define domain model with JPA annotations
2. **Create Repository** → Extend JpaRepository for data access
3. **Create Service** → Add business logic
4. **Create DTO** → Define API contract
5. **Create Controller** → Implement REST endpoints
6. **Write Tests** → Ensure quality and coverage
7. **Run Tests** → Verify functionality
8. **Build & Deploy** → Package as JAR

## Performance Considerations

- **Indexes**: Created on frequently searched columns (name, email)
- **Pagination**: Can be added if dataset grows large
- **Caching**: Redis can be integrated for frequently accessed data
- **Connection Pooling**: Configured in Spring Boot

## Security Considerations

- **Input Validation**: Bean Validation at API boundary
- **SQL Injection**: JPA prevents through parameterized queries
- **XSS Prevention**: No direct HTML output
- **CORS**: Configure based on frontend origin
- **Authentication**: Can be added in Phase 2 if needed

## Future Enhancements

- [ ] Add pagination and sorting
- [ ] Implement authentication & authorization
- [ ] Add API versioning
- [ ] Implement caching (Redis)
- [ ] Add Elasticsearch for full-text search
- [ ] Implement API documentation (Swagger/OpenAPI)
- [ ] Add logging framework (SLF4J/Logback)
- [ ] Implement transaction management
- [ ] Add audit trail

## IDE Setup

### VS Code
```bash
# Install Extensions
- Extension Pack for Java
- Spring Boot Extension Pack
- Maven for Java
```

### IntelliJ IDEA
- Built-in Spring Support
- Built-in Maven Integration

### Eclipse
- Eclipse IDE for Java Developers
- Spring Tools Suite (optional)

## Contributing

1. Follow Java naming conventions
2. Write unit tests for new code
3. Maintain >80% test coverage
4. Follow SOLID principles
5. Ensure code builds without warnings

## License

Not specified

## Contact

For issues or questions, contact the development team.
