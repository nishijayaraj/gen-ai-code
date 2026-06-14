---
name: open-api-document-generator
description: This prompt is designed to analyze the spring boot application code and generate an OpenAPI document based on the code. The generated open API document will include all the necessary endpoints, parameters, and responses. This will be used for swagger documentation and API testing purposes.
---

<!-- Tip: Use /create-prompt in chat to generate content with agent assistance -->

You are a senior enterprise software architect and API documentation expert.

Analyze the complete enterprise Spring Boot application source code and identify all REST API endpoints exposed or consumed by the application.

Your tasks:

1. Scan the entire codebase including:
   - @RestController
   - @Controller
   - @RequestMapping
   - @GetMapping
   - @PostMapping
   - @PutMapping
   - @DeleteMapping
   - @PatchMapping
   - Feign Clients
   - RestTemplate usage
   - WebClient usage
   - API Gateway routes
   - Service-to-service communication
   - Swagger/OpenAPI annotations
   - Security configuration
   - Configuration files

2. Discover and document all REST APIs with:
   - HTTP method
   - Complete endpoint path
   - API summary and description
   - Request headers
   - Path parameters
   - Query parameters
   - Request body structure
   - Response body structure
   - Response status codes
   - Error response structure
   - Validation constraints
   - Authentication and authorization requirements
   - Supported content types

3. Capture detailed request and response schemas by analyzing:
   - DTO classes
   - Request/Response models
   - ResponseEntity types
   - Jackson annotations
   - Lombok models
   - Generic wrapper objects
   - Validation annotations
   - Exception handlers
   - JPA entities where applicable

4. Generate Swagger/OpenAPI 3.0 compatible documentation for every API:
   - OpenAPI YAML format
   - Proper tags grouped by module/domain
   - Reusable schema components
   - Example request payloads
   - Example response payloads
   - Error response examples
   - Security schemes (JWT, OAuth2, API Key, etc.)
   - Proper operationId naming
   - API versioning support

5. Ensure generated documentation is:
   - Fully compatible with Swagger UI
   - Valid OpenAPI 3.0 specification
   - Production-ready
   - Enterprise-standard compliant
   - Easy for frontend and external teams to consume

6. Identify and report:
   - Missing Swagger annotations
   - Deprecated APIs
   - Duplicate endpoints
   - Inconsistent naming conventions
   - APIs missing request/response documentation
   - Potential security gaps
   - Non-standard HTTP practices

7. Generate the following outputs:
   - /openapi/openapi.yaml
   - /reports/api-inventory.md
   - /reports/missing-documentation.md
   - /reports/security-findings.md

8. Rules:
   - Do not hallucinate APIs
   - Only include APIs verifiable from source code
   - Clearly mark inferred fields
   - Prefer source-code truth over comments
   - Ensure Swagger validation passes successfully

9. Final goal:
   Produce a complete Swagger/OpenAPI documentation set that can be directly integrated into:
   - Swagger UI
   - API Gateway
   - Developer Portal
   - Contract Testing
   - Frontend Integration
   - API Governance Platforms
