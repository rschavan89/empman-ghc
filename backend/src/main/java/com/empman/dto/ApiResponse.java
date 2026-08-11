package com.empman.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

/**
 * API Response Wrapper
 * 
 * Standard response format for all API endpoints.
 * Wraps the actual response data with metadata (success status, message, timestamp).
 * 
 * Used for both success and error responses to provide consistency.
 * 
 * @param <T> Type of data in the response
 * 
 * @since 1.0.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiResponse<T> {

    /**
     * Indicates whether the operation was successful.
     * - true: Operation completed successfully
     * - false: Operation failed
     */
    private Boolean success;

    /**
     * The actual response data.
     * - For success responses: Contains the requested/created/updated data
     * - For error responses: Contains null or error details
     */
    private T data;

    /**
     * Human-readable message describing the result.
     * - For success: "Operation successful", "Employee created", etc.
     * - For error: Specific error description
     */
    private String message;

    /**
     * List of field-level errors (for validation failures).
     * Each error contains the field name and error message.
     * Null for non-validation errors.
     */
    private List<FieldError> errors;

    /**
     * Timestamp when the response was generated.
     * ISO 8601 format for consistency.
     */
    private LocalDateTime timestamp;

    /**
     * Constructs a success response with data and message.
     * 
     * @param data the response data
     * @param message the success message
     * @return ApiResponse with success=true
     */
    public static <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder()
                .success(true)
                .data(data)
                .message(message)
                .timestamp(LocalDateTime.now())
                .build();
    }

    /**
     * Constructs an error response with message.
     * 
     * @param message the error message
     * @return ApiResponse with success=false
     */
    public static <T> ApiResponse<T> error(String message) {
        return ApiResponse.<T>builder()
                .success(false)
                .data(null)
                .message(message)
                .timestamp(LocalDateTime.now())
                .build();
    }

    /**
     * Constructs an error response with message and field errors.
     * 
     * @param message the error message
     * @param errors list of field-level errors
     * @return ApiResponse with success=false and error details
     */
    public static <T> ApiResponse<T> error(String message, List<FieldError> errors) {
        return ApiResponse.<T>builder()
                .success(false)
                .data(null)
                .message(message)
                .errors(errors)
                .timestamp(LocalDateTime.now())
                .build();
    }

    /**
     * Nested class representing a field-level error.
     * Used to provide detailed validation error information.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FieldError {

        /**
         * The name of the field that failed validation.
         * Example: "email", "salary", "name"
         */
        private String field;

        /**
         * The validation error message for this field.
         * Example: "Email must be a valid email address"
         */
        private String message;

    }

}
