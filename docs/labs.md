
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
# Labs Features Documentation

## Overview

Labs features are experimental capabilities that extend the core Creeator platform with advanced AI crew management and task planning tools. These features are disabled by default and can be enabled via feature flags.

## Feature Flags

### Environment Variables

Set these in your `.env` file to enable Labs features:

```env
# Enable AI Crews feature
VITE_FEATURE_CREWS=true

# Enable Task Planner feature  
VITE_FEATURE_PLANNER=true
```

### Behavior

- When **no flags** are set to `true`, the Labs floating button is hidden
- When **any flag** is set to `true`, a Labs floating button appears in the bottom-right corner
- Each feature's UI is only accessible when its corresponding flag is enabled

## AI Crews

### Overview

AI Crews allow you to create reusable AI content generation workflows using templates. Each crew can be configured with specific inputs and run multiple times to generate drafts.

### Data Models

#### CrewTemplate
- `id`: Unique identifier
- `name`: Template name (e.g., "Blog Post OS")
- `purpose`: Template description
- `fields_json`: Input fields configuration
- `prompt_schema_json`: AI prompt templates

#### Crew
- `id`: Unique identifier  
- `name`: Crew instance name
- `template_id`: Reference to CrewTemplate
- `purpose`: Crew description
- `inputs_json`: Configured input values
- `status`: `draft|queued|done|failed`
- `tags`: Comma-separated tags

#### CrewRun
- `id`: Unique identifier
- `crew_id`: Reference to Crew
- `input_snapshot_json`: Input values at run time
- `output_snapshot_json`: Generated content
- `tokens_used`: AI token consumption
- `status`: `queued|running|done|failed`

#### CrewDraft
- `id`: Unique identifier
- `crew_id`: Reference to Crew
- `content_md`: Generated markdown content
- `seo_meta_json`: SEO metadata
- `score`: Quality score (0-100)

### API Endpoints

```
GET /api/crew-templates     # List available templates
GET /api/crews             # List user's crews
POST /api/crews            # Create new crew
POST /api/crews/:id/run    # Execute crew
GET /api/crews/:id/drafts  # Get generated drafts
```

### Routes

- `/labs/crews` - List all crews
- `/labs/crews/:id` - Edit crew (editor view)

## Task Planner

### Overview

Task Planner provides kanban board and calendar views for managing tasks with intelligent auto-scheduling capabilities.

### Data Models

#### Task
- `id`: Unique identifier
- `title`: Task name
- `notes`: Additional details
- `priority`: `low|med|high`
- `est_minutes`: Estimated duration
- `due_at`: Due date/time
- `hard_deadline`: Boolean flag
- `status`: `todo|doing|blocked|done`
- `tags`: Comma-separated tags

#### EventBlock
- `id`: Unique identifier
- `task_id`: Reference to Task
- `starts_at`: Scheduled start time
- `ends_at`: Scheduled end time  
- `source`: `auto|manual`
- `calendar_id`: External calendar integration

#### WorkHours
- `id`: Unique identifier
- `user_id`: Reference to User
- `weekday`: 0-6 (Monday-Sunday)
- `start_time`: Work start time
- `end_time`: Work end time
- `timezone`: User timezone

### API Endpoints

```
GET /api/tasks              # List tasks
POST /api/tasks             # Create task
PATCH /api/tasks/:id        # Update task
DELETE /api/tasks/:id       # Delete task
POST /api/scheduler/plan    # Generate schedule
GET /api/blocks             # Get event blocks
POST /api/blocks/commit     # Save schedule
```

### Routes

- `/labs/planner/board` - Kanban board view
- `/labs/planner/calendar` - Calendar view with auto-scheduling

### Scheduling Algorithm

The auto-scheduler uses a simple algorithm:

1. **Sort tasks** by: hard_deadline (desc), priority (desc), due_at (asc)
2. **Pack into work hours** (default: 9 AM - 5 PM, Mon-Fri)
3. **Chunk blocks** to ≤ 90 minutes with 15-minute breaks
4. **Avoid overlaps** and respect hard deadlines
5. **Return proposals** for user confirmation before committing

## Seed Data

The system includes sample data for testing:

### Crew Templates
1. **Blog Post OS** - Comprehensive blog post generation
2. **Landing Page** - High-converting landing page copy  
3. **Ad Set** - Multiple ad variations for A/B testing

### Sample Tasks
- Marketing strategy (high priority, hard deadline)
- Product mockups (high priority)
- Competitor analysis (medium priority, in progress)
- Documentation updates (low priority)
- Team standup prep (medium priority)
- Code review backlog (medium priority, blocked)

## Testing

### With API Keys
When OpenAI/Anthropic API keys are present in environment:
- Crews will generate real AI content
- Token usage will be tracked
- Processing time varies by model

### Without API Keys  
When no API keys are configured:
- Crews generate mock content after 2-second delay
- Mock token usage (150 tokens)
- Demonstrates full workflow without API costs

### Verification Steps

1. **Feature Flags Off**: No Labs button visible
2. **FEATURE_CREWS=true**: Crews list accessible, can create/run crews
3. **FEATURE_PLANNER=true**: Board and calendar views work
4. **Auto-scheduling**: Sample tasks schedule without overlaps
5. **Data Persistence**: All operations save to SQLite database

## Development Notes

- All Labs code is additive - no existing functionality is modified
- UI components use `.labs-*` CSS classes for scoped styling
- Backend uses separate modules under `server/modules/`
- Database migrations are automatic on server start
- Feature flags are checked at both route and component levels
