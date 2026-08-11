package com.empman.exception;

import com.empman.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.ArrayList;
import java.util.List;

/**
 * Global Exception Handler
 * 
 * Centralized exception handling for the entire application.
 * Converts application exceptions to appropriate HTTP responses.
 * Ensures consistent error response format across all endpoints.
 * 
 * Exception Handling:
 * - EmployeeNotFoundException → 404 Not Found
 * - EmployeeAlreadyExistsException → 409 Conflict
 * - ValidationFailedException → 400 Bad Request
 * - MethodArgumentNotValidException → 400 Bad Request (with field errors)
 * - Generic Exception → 500 Internal Server Error
 * 
 * @since 1.0.0
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handle EmployeeNotFoundException (404 Not Found)
     * 
     * @param ex the exception
     * @return ResponseEntity with 404 status and error details
     */
    @ExceptionHandler(EmployeeNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<ApiResponse<?>> handleEmployeeNotFoundException(EmployeeNotFoundException ex) {
        ApiResponse<?> response = ApiResponse.error(ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    /**
     * Handle EmployeeAlreadyExistsException (409 Conflict)
     * 
     * Thrown when attempting to create an employee with a duplicate email.
     * 
     * @param ex the exception
     * @return ResponseEntity with 409 status and error details
     */
    @ExceptionHandler(EmployeeAlreadyExistsException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ResponseEntity<ApiResponse<?>> handleEmployeeAlreadyExistsException(EmployeeAlreadyExistsException ex) {
        ApiResponse<?> response = ApiResponse.error(ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    /**
     * Handle ValidationFailedException (400 Bad Request)
     * 
     * @param ex the exception
     * @return ResponseEntity with 400 status and error details
     */
    @ExceptionHandler(ValidationFailedException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ApiResponse<?>> handleValidationFailedException(ValidationFailedException ex) {
        ApiResponse<?> response = ApiResponse.error(ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * Handle MethodArgumentNotValidException (400 Bad Request)
     * 
     * Spring throws this when @Valid annotation validation fails.
     * Extracts field-level errors and includes them in response.
     * 
     * @param ex the exception
     * @return ResponseEntity with 400 status and field-level error details
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ApiResponse<?>> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        List<ApiResponse.FieldError> fieldErrors = new ArrayList<>();

        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            fieldErrors.add(ApiResponse.FieldError.builder()
                    .field(fieldName)
                    .message(errorMessage)
                    .build());
        });

        ApiResponse<?> response = ApiResponse.error("Validation failed", fieldErrors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * Handle generic exceptions (500 Internal Server Error)
     * 
     * Catches any unexpected exceptions not handled by specific handlers.
     * 
     * @param ex the exception
     * @return ResponseEntity with 500 status and error message
     */
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<ApiResponse<?>> handleGenericException(Exception ex) {
        String message = "An unexpected error occurred";
        if (ex.getMessage() != null && !ex.getMessage().isEmpty()) {
            message = ex.getMessage();
        }

        ApiResponse<?> response = ApiResponse.error(message);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

}
