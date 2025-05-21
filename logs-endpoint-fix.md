# Fixing the `/api/logs` Endpoint 500 Error

## Problem Description
The `/api/logs` endpoint was returning a 500 error due to a field naming inconsistency. The error occurred because the pagination system was trying to sort by a field named `createdAt`, but the `Log` model in Prisma uses a field named `fecha` for the timestamp.

## Root Cause Analysis
1. The base `PaginationDto` defines a default `sortBy` value of `'createdAt'`
2. The `Log` model in Prisma schema does not have a `createdAt` field, but instead uses `fecha`
3. When the API received a request without specifying a sort field, it defaulted to `'createdAt'` which does not exist in the Log model

## Fix Implementation
Our solution involved two key changes:

### 1. Create a Log-specific Pagination DTO
Created a `LogPaginationDto` that extends the base `PaginationDto` but overrides the default `sortBy` value to use `'fecha'` instead of `'createdAt'`:

```typescript
// Override the PaginationDto for Logs to use 'fecha' as default sortBy
export class LogPaginationDto extends PaginationDto {
  @IsOptional()
  @IsString()
  sortBy?: string = 'fecha'; // Override default 'createdAt' to use 'fecha'
}

export class LogFilterDto extends LogPaginationDto {
  // ... existing code ...
}
```

### 2. Add Field Mapping Logic in the Service
Added a safety check in the service to map the `createdAt` field to `fecha` if it's used:

```typescript
// Sorting settings
// Override the default sortBy if it's 'createdAt' since Log model uses 'fecha'
let sortBy = filters.sortBy || 'fecha';
if (sortBy === 'createdAt') {
  sortBy = 'fecha';
}
const sortOrder = filters.sortOrder || 'desc';
const orderBy = { [sortBy]: sortOrder };
```

### 3. Improved Error Handling
Added better error handling to provide more context when errors occur, helping with future debugging:

```typescript
catch (error) {
  console.error('Error fetching paginated logs:', error);
  console.error('Query parameters:', { 
    whereClause, 
    orderBy, 
    skip, 
    limit,
    sortBy,
    filters
  });
  throw new Error(`Error al obtener los logs con paginación: ${error.message}`);
}
```

## Model Field Naming Consistency
This issue highlights the importance of maintaining consistent field naming across models. In this project:
- Most models use `createdAt` for creation timestamps
- The `Log` model uses `fecha` instead

When designing new features or making changes, we should always be aware of these differences to prevent similar issues.

## Testing
The endpoint was tested with various combinations of filter and pagination parameters, including:
- Default sorting (no sortBy parameter)
- Explicit sortBy=fecha
- Explicit sortBy=createdAt (which should be mapped to fecha)
- Various filter combinations

The endpoint now works correctly in all these scenarios.
