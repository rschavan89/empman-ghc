package com.empman.exception;

/**
 * Employee Already Exists Exception
 * 
 * Thrown when attempting to create or update an employee with an email
 * that already exists in the database.
 * This exception results in a 409 Conflict HTTP response.
 * 
 * @since 1.0.0
 */
public class EmployeeAlreadyExistsException extends RuntimeException {

    /**
     * Constructs an EmployeeAlreadyExistsException with a detail message.
     * 
     * @param message the detail message
     */
    public EmployeeAlreadyExistsException(String message) {
        super(message);
    }

    /**
     * Constructs an EmployeeAlreadyExistsException with a detail message and cause.
     * 
     * @param message the detail message
     * @param cause the cause
     */
    public EmployeeAlreadyExistsException(String message, Throwable cause) {
        super(message, cause);
    }

}
