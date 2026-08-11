package com.empman.repository;

import com.empman.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Employee Repository
 * 
 * Spring Data JPA repository for Employee entity.
 * Inherits standard CRUD operations from JpaRepository.
 * 
 * Standard operations (inherited):
 * - save(Employee): Create or update an employee
 * - findById(Long): Get employee by ID
 * - findAll(): Get all employees
 * - delete(Employee): Delete an employee
 * - deleteById(Long): Delete employee by ID
 * - exists(Long): Check if employee exists
 * 
 * Custom operations:
 * - findByNameContainingIgnoreCase(String): Search employees by name (case-insensitive)
 * 
 * @since 1.0.0
 */
@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    /**
     * Find all employees whose name contains the given search term.
     * Search is case-insensitive.
     * 
     * @param name Search term for employee name
     * @return List of employees matching the search term
     * @example
     *   findByNameContainingIgnoreCase("John") 
     *   returns: [Employee(name="John Doe"), Employee(name="john Smith")]
     */
    List<Employee> findByNameContainingIgnoreCase(String name);

}
