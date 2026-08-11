package com.empman.exception;

/**
 * Validation Failed Exception
 * 
 * Thrown when input validation fails for employee data.
 * This exception results in a 400 Bad Request HTTP response.
 * 
 * @since 1.0.0
 */
public class ValidationFailedException extends RuntimeException {

    /**
     * Constructs a ValidationFailedException with a detail message.
     * 
     * @param message the detail message
     */
    public ValidationFailedException(String message) {
        super(message);
    }

    /**
     * Constructs a ValidationFailedException with a detail message and cause.
     * 
     * @param message the detail message
     * @param cause the cause
     */
    public ValidationFailedException(String message, Throwable cause) {
        super(message, cause);
    }

}
