package com.empman.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Employee Entity
 * 
 * Represents an employee record in the system.
 * 
 * Fields:
 * - id: Unique identifier (auto-generated)
 * - name: Employee name (required)
 * - email: Employee email (required, unique, must be valid email format)
 * - department: Department name (required)
 * - salary: Employee salary (required, must be positive)
 * - createdAt: Timestamp when employee was created
 * - updatedAt: Timestamp when employee was last updated
 * 
 * Constraints:
 * - Email must be unique across all employees
 * - All fields are required (NOT NULL)
 * - Salary must be a positive value
 * - Email must follow valid email format
 * 
 * @since 1.0.0
 */
@Entity
@Table(name = "employee", indexes = {
    @Index(name = "idx_email", columnList = "email"),
    @Index(name = "idx_name", columnList = "name")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee {

    /**
     * Unique identifier for the employee.
     * Auto-generated using identity strategy.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Employee name (required, max 255 characters).
     */
    @NotBlank(message = "Name is required")
    @Column(nullable = false, length = 255)
    private String name;

    /**
     * Employee email (required, unique, valid email format, max 255 characters).
     */
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Column(nullable = false, unique = true, length = 255)
    private String email;

    /**
     * Employee department (required, max 255 characters).
     */
    @NotBlank(message = "Department is required")
    @Column(nullable = false, length = 255)
    private String department;

    /**
     * Employee salary (required, must be positive).
     * Stored as DECIMAL(19, 2) for precise financial calculations.
     */
    @NotNull(message = "Salary is required")
    @Positive(message = "Salary must be a positive value")
    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal salary;

    /**
     * Timestamp when the employee record was created.
     * Automatically set by the database.
     */
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * Timestamp when the employee record was last updated.
     * Automatically updated by the database.
     */
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    /**
     * JPA lifecycle callback - automatically set createdAt and updatedAt
     * when the entity is first persisted.
     */
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    /**
     * JPA lifecycle callback - automatically update updatedAt
     * when the entity is updated.
     */
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /**
     * String representation of the Employee entity.
     * Format: Employee(id, name, email, department, salary)
     * 
     * @return String representation
     */
    @Override
    public String toString() {
        return "Employee{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", department='" + department + '\'' +
                ", salary=" + salary +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }

}
