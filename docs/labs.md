
# Labs Features Documentation

## Overview

The Labs module provides experimental features for content workflow automation (Crews) and intelligent task scheduling (Planner). These features are designed to extend the core Creeator platform without affecting existing functionality.

## Architecture

### Backend Structure
```
server/
├── modules/
│   ├── crews/
│   │   ├── models.js      # Data access layer
│   │   ├── controller.js  # Business logic
│   │   └── routes.js      # API endpoints
│   └── planner/
│       ├── models.js      # Data access layer
│       ├── controller.js  # Business logic & scheduler
│       └── routes.js      # API endpoints
└── seed-labs.js          # Demo data seeding
```

### Frontend Structure
```
client/src/
├── components/labs/
│   └── LabsNav.jsx        # Navigation component
├── pages/labs/
│   ├── CrewsList.jsx      # Crews management
│   ├── CrewDrafts.jsx     # Content editor
│   ├── PlannerBoard.jsx   # Kanban board
│   └── PlannerCalendar.jsx # Calendar view
└── components/
    └── LabsFloatingButton.jsx # Feature access
```

## Feature Flags

Labs features are controlled by environment variables:

- `FEATURE_CREWS=true|false` - Enables/disables Crews functionality
- `FEATURE_PLANNER=true|false` - Enables/disables Planner functionality

When disabled, the features are completely inaccessible (API returns 404).

## Data Models

### Crews (Content Workflows)

#### CrewTemplate
- Reusable workflow blueprints
- Define input fields and generation parameters
- JSON schema for prompts and configuration

#### Crew
- Instance of a template with specific inputs
- Tracks generation status and metadata
- Links to generated drafts

#### CrewDraft
- Generated content with SEO analysis
- Markdown format with metadata
- Scoring and optimization suggestions

#### CrewRun
- Execution log with token usage
- Input/output snapshots
- Performance tracking

### Planner (Task Scheduling)

#### Task
- Basic task information with priority and estimates
- Due dates and deadline constraints
- Status tracking (todo/doing/blocked/done)

#### TaskLink
- Dependency relationships between tasks
- Used for scheduling constraints

#### WorkHours
- User availability windows
- Per-weekday time slots
- Timezone support

#### EventBlock
- Scheduled time blocks for tasks
- Auto-generated or manual
- Calendar integration placeholders

#### CalendarSource
- External calendar connections (stub)
- Sync status tracking

## API Endpoints

### Crews API (`/api/crews`)

```
POST /templates              # Create workflow template
GET  /templates              # List available templates
POST /                       # Create new crew instance
GET  /                       # List user's crews
POST /:id/run               # Execute crew workflow
GET  /:id/drafts            # Retrieve generated content
```

### Planner API (`/api/planner`)

```
POST /tasks                 # Create new task
GET  /tasks                 # List user's tasks
PATCH /tasks/:id            # Update task
POST /scheduler/plan        # Generate schedule proposal
POST /blocks/commit         # Save schedule blocks
GET  /blocks                # Retrieve scheduled blocks
POST /calendars/sync        # Sync external calendars (stub)
```

## Scheduler Algorithm

The auto-scheduler uses a greedy algorithm with the following logic:

1. **Task Prioritization**: Sort by hard deadline (desc), priority (desc), due date (asc)
2. **Time Chunking**: Split long tasks into ≤90 minute blocks
3. **Constraint Checking**: Respect work hours, deadlines, and existing blocks
4. **Conflict Avoidance**: Ensure no overlapping assignments
5. **Deadline Enforcement**: Never schedule past hard deadlines

### Implementation Details

```javascript
// Simplified scheduler logic
const scheduleTasksIntoBlocks = (tasks, workHours, existingBlocks) => {
  const sortedTasks = tasks.sort((a, b) => {
    if (a.hard_deadline !== b.hard_deadline) return b.hard_deadline - a.hard_deadline;
    if (a.priority !== b.priority) return priorityWeight[b.priority] - priorityWeight[a.priority];
    return new Date(a.due_at) - new Date(b.due_at);
  });
  
  // Fit tasks into available work windows
  return fitTasksIntoSlots(sortedTasks, workHours, existingBlocks);
};
```

## UI Components

### Labs Navigation
- Consistent navigation across Labs features
- Feature availability indicators
- Beta labeling and context

### Crews Interface
- Template-based crew creation wizard
- Real-time content preview and editing
- SEO scoring and optimization hints

### Planner Interface
- Drag-and-drop Kanban board
- Calendar view with time blocking
- Auto-scheduling with manual override

## Styling Guidelines

All Labs styles use the `.labs-` prefix to prevent conflicts:

```css
.labs-nav { /* Navigation styling */ }
.labs-kanban-column { /* Board column styling */ }
.labs-content-preview { /* Content preview styling */ }
```

## Setup Instructions

1. **Enable Features**:
   ```bash
   # In .env file
   FEATURE_CREWS=true
   FEATURE_PLANNER=true
   ```

2. **Initialize Database**:
   ```bash
   # Tables are created automatically on server start
   npm start
   ```

3. **Seed Demo Data**:
   ```bash
   node server/seed-labs.js
   ```

4. **Access Features**:
   - Navigate to `/labs/crews` or `/labs/planner/board`
   - Or use the floating Labs button in the dashboard

## Integration Points

### Content Generation
- Uses existing AI service keys if available
- Falls back to mock content for demo purposes
- Maintains token usage tracking

### Calendar Sync
- Placeholder endpoints for external calendar APIs
- Returns sync status without external calls
- Extensible for future integrations

## Testing

### Unit Tests
Run scheduler tests to verify algorithm correctness:

```bash
npm test -- --grep "scheduler"
```

### Feature Tests
- Crews: Template creation, content generation, draft management
- Planner: Task management, scheduling, calendar views

### Smoke Tests
With features enabled, verify:
- Labs button appears in dashboard
- Routes render without errors
- API endpoints respond correctly
- No conflicts with existing features

## Security Considerations

- All API keys remain server-side only
- Feature flags prevent unauthorized access
- User authentication required for all endpoints
- Input validation on all user-provided data

## Performance Notes

- Database queries are optimized with proper indexing
- Content generation is asynchronous where possible
- Calendar views paginated by week to limit data transfer
- Scheduler algorithm complexity is O(n*m) where n=tasks, m=time slots

## Future Enhancements

### Crews
- Custom AI model selection
- Template marketplace
- Collaborative editing
- Advanced SEO analysis

### Planner
- Real calendar integrations (Google, Outlook)
- Machine learning for time estimates
- Team scheduling coordination
- Mobile app support

## Troubleshooting

### Common Issues

1. **Labs button not visible**: Check feature flags in environment
2. **API 404 errors**: Ensure features are enabled and server restarted
3. **Scheduling conflicts**: Verify work hours are configured
4. **Content generation fails**: Check AI service keys (falls back to mock)

### Debug Mode
Enable verbose logging:
```bash
DEBUG=labs:* npm start
```

## Migration Notes

All Labs tables are created with `IF NOT EXISTS` clauses and are completely separate from existing data structures. The features can be safely enabled/disabled without affecting core functionality.

To remove Labs data:
```sql
DROP TABLE IF EXISTS crew_templates;
DROP TABLE IF EXISTS crews;
DROP TABLE IF EXISTS crew_drafts;
DROP TABLE IF EXISTS crew_runs;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS task_links;
DROP TABLE IF EXISTS work_hours;
DROP TABLE IF EXISTS event_blocks;
DROP TABLE IF EXISTS calendar_sources;
```
