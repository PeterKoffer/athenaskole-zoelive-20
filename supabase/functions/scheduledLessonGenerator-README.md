# Scheduled Lesson Generator

This Supabase Edge Function automatically generates daily lessons for all classes in the system.

## Purpose

The `scheduledLessonGenerator.ts` function:
- Retrieves all classes from the system (currently using mock data)
- For each class, checks if a lesson exists for today
- If not, generates and stores a new lesson for each subject the class teaches
- Associates generated lessons with class ID, subject, and date
- Provides comprehensive logging and error handling

## Usage

### As a Scheduled Function (Cron Job)

This function is designed to be run daily as a scheduled task. You can set up a cron job or use Supabase's scheduled functions to call this endpoint once per day.

### Manual Invocation

You can also call the function manually for testing or one-time generation:

#### Generate lessons for all classes (GET or POST)
```bash
curl -X POST https://your-project.supabase.co/functions/v1/scheduledLessonGenerator
```

#### Generate lessons for specific classes only
```bash
curl -X POST https://your-project.supabase.co/functions/v1/scheduledLessonGenerator \
  -H "Content-Type: application/json" \
  -d '{"classIds": ["1a", "1b"]}'
```

#### Generate lessons for a specific date
```bash
curl -X POST https://your-project.supabase.co/functions/v1/scheduledLessonGenerator \
  -H "Content-Type: application/json" \
  -d '{"date": "2024-01-15"}'
```

#### Generate lessons for specific classes and date
```bash
curl -X POST https://your-project.supabase.co/functions/v1/scheduledLessonGenerator \
  -H "Content-Type: application/json" \
  -d '{"classIds": ["1a"], "date": "2024-01-15"}'
```

## Request Parameters

When making a POST request, you can include the following optional parameters:

- `classIds` (string[]): Array of class IDs to process. If not provided, all classes will be processed.
- `date` (string): Target date in YYYY-MM-DD format. If not provided or invalid, today's date will be used.

Example request body:
```json
{
  "classIds": ["1a", "1b"],
  "date": "2024-01-15"
}
```

## Response Format

```json
{
  "success": true,
  "message": "Scheduled lesson generation completed",
  "results": {
    "date": "2024-01-15",
    "totalClasses": 2,
    "processedClasses": 2,
    "generatedLessons": 4,
    "skippedLessons": 0,
    "errors": [],
    "details": [
      {
        "classId": "1a",
        "className": "1.A",
        "generatedCount": 2,
        "skippedCount": 0,
        "subjects": ["Matematik", "Dansk"]
      }
    ]
  }
}
```

## Data Structure

### Class Data
Currently uses mock data structure:
```typescript
interface ClassData {
  id: string;
  name: string;
  grade: string;
  teacher: string;
  subject: string; // Can be combined like "Matematik & Dansk"
  students: Array<{
    id: string;
    name: string;
    email: string;
  }>;
}
```

### Generated Lesson Data
Lessons are stored in the `lesson_progress` table with:
- `user_id`: Set to `"class-{classId}"` to identify class-based lessons
- `subject`: Individual subject extracted from class subject string
- `lesson_data`: Complete lesson structure with activities and metadata
- `created_at`: Set to the target date for the lesson

## Database Integration

The function stores lessons in the existing `lesson_progress` table using a class-based `user_id` pattern (`class-{classId}`). This approach:
- Reuses existing database structure
- Maintains compatibility with existing lesson delivery code
- Allows easy identification of class vs. individual lessons
- Preserves all existing lesson functionality

## Error Handling

The function includes comprehensive error handling:
- Individual class failures don't stop processing of other classes
- Database errors are logged and reported
- Detailed error information is included in the response
- Graceful degradation when services are unavailable

## Future Enhancements

When a proper classes table is implemented in the database:
1. Replace the `getAllClasses()` function to query the database instead of using mock data
2. Consider adding a dedicated table for class-based lessons if more complex metadata is needed
3. Implement more sophisticated lesson generation that considers individual student progress within the class

## Dependencies

- Supabase client library
- Deno standard library
- Existing lesson generation infrastructure (conceptually)

## Environment Variables

Requires standard Supabase environment variables:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`