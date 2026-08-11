package com.empman;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Employee Manager Application - Main Entry Point
 * 
 * This is the main Spring Boot application class that starts the Employee Management System.
 * 
 * Features:
 * - REST API for employee management (add, view, update, delete, search)
 * - H2 in-memory database for development
 * - Spring Data JPA for ORM
 * - Input validation and error handling
 * 
 * Access H2 Console at: http://localhost:8080/h2-console
 * JDBC URL: jdbc:h2:mem:empmandb
 * 
 * @since 1.0.0
 */
@SpringBootApplication
public class EmployeeManagerApplication {

    public static void main(String[] args) {
        SpringApplication.run(EmployeeManagerApplication.class, args);
    }

}
