package com.empman.exception;

/**
 * Employee Not Found Exception
 * 
 * Thrown when an employee with a specific ID cannot be found in the database.
 * This exception results in a 404 Not Found HTTP response.
 * 
 * @since 1.0.0
 */
public class EmployeeNotFoundException extends RuntimeException {

    /**
     * Constructs an EmployeeNotFoundException with a detail message.
     * 
     * @param message the detail message
     */
    public EmployeeNotFoundException(String message) {
        super(message);
    }

    /**
     * Constructs an EmployeeNotFoundException with a detail message and cause.
     * 
     * @param message the detail message
     * @param cause the cause
     */
    public EmployeeNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

}
