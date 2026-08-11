# Employee Manager - Copilot Instructions
## Purpose
This repository demonstrates an Agentic Software Development
Lifecycle using GitHub Copilot.
Copilot must work collaboratively with a human developer.

The human remains responsible for approving:
- Requirements
- Architecture
- Design decisions
- Implementation plan
- Source-code changes
- Pull Request

## Application
Build a simple Employee Management application.

## Functional Requirements
The application should support:
1. Add Employee
2. View Employees
3. View Employee by ID
4. Update Employee
5. Delete Employee
6. Search Employee

## Employee Fields
- id
- name
- email
- department
- salary

## Technology
Frontend:
- React

Backend:
- Spring Boot
- Java

Database:
- H2

Testing:
- JUnit
- Rest Assured

## Engineering Principles
Follow:
- SOLID
- DRY
- Clean Code
- Separation of Concerns
- REST principles
- Secure coding practices

## Important Rules
1. Do not invent missing business requirements.
2. Mark unavailable information as "Not Found".
3. Ask clarification questions when requirements are ambiguous.
4. Do not implement production code before architecture approval.
5. Do not change approved architecture without documenting the change.
6. Human approval is required before implementation.
7. All requirements must be traceable to implementation and tests.
8. All generated code must be reviewed.
9. Never commit secrets.
10. Run tests before creating a PR.