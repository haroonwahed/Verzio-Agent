
const db = require('./db');

async function seedLabsData() {
  try {
    console.log('Seeding Labs data...');

    // Only seed if features are enabled
    if (process.env.VITE_FEATURE_CREWS === 'true') {
      console.log('Seeding Crews data...');
      
      // Create crew templates
      const templates = [
        {
          name: 'Blog Post OS',
          purpose: 'Generate comprehensive blog posts with SEO optimization',
          fields: [
            { name: 'title', label: 'Title', type: 'text', required: true, placeholder: 'Enter blog post title' },
            { name: 'introduction', label: 'Introduction', type: 'textarea', required: true, placeholder: 'Brief introduction' },
            { name: 'keyPoint1', label: 'Key Point 1', type: 'text', required: true },
            { name: 'keyPoint2', label: 'Key Point 2', type: 'text', required: true },
            { name: 'keyPoint3', label: 'Key Point 3', type: 'text', required: true },
            { name: 'conclusion', label: 'Conclusion', type: 'textarea', required: true },
            { name: 'keywords', label: 'SEO Keywords', type: 'text', required: false, placeholder: 'Comma-separated keywords' }
          ],
          promptSchema: {
            tone: 'professional',
            style: 'informative',
            length: 'long-form',
            includeReferences: true
          }
        },
        {
          name: 'Landing Page',
          purpose: 'Create high-converting landing page copy',
          fields: [
            { name: 'headline', label: 'Headline', type: 'text', required: true, placeholder: 'Main headline' },
            { name: 'subheadline', label: 'Subheadline', type: 'text', required: true, placeholder: 'Supporting subheadline' },
            { name: 'description', label: 'Description', type: 'textarea', required: true, placeholder: 'Product/service description' },
            { name: 'benefit1', label: 'Key Benefit 1', type: 'text', required: true },
            { name: 'benefit2', label: 'Key Benefit 2', type: 'text', required: true },
            { name: 'benefit3', label: 'Key Benefit 3', type: 'text', required: true },
            { name: 'cta', label: 'Call to Action', type: 'text', required: true, placeholder: 'e.g., Start Free Trial' }
          ],
          promptSchema: {
            tone: 'persuasive',
            style: 'benefit-focused',
            urgency: 'moderate',
            socialProof: true
          }
        },
        {
          name: 'Ad Set',
          purpose: 'Generate ad copy for multiple platforms',
          fields: [
            { name: 'headline', label: 'Headline', type: 'text', required: true, placeholder: 'Attention-grabbing headline' },
            { name: 'description', label: 'Description', type: 'textarea', required: true, placeholder: 'Ad description' },
            { name: 'cta', label: 'Call to Action', type: 'text', required: true, placeholder: 'e.g., Shop Now, Learn More' },
            { name: 'audience', label: 'Target Audience', type: 'text', required: true, placeholder: 'Who is this ad for?' },
            { name: 'message1', label: 'Key Message 1', type: 'text', required: true },
            { name: 'message2', label: 'Key Message 2', type: 'text', required: true },
            { name: 'message3', label: 'Key Message 3', type: 'text', required: true }
          ],
          promptSchema: {
            tone: 'engaging',
            style: 'concise',
            platform: 'multi-platform',
            urgency: 'high'
          }
        }
      ];

      for (const template of templates) {
        const stmt = db.prepare(`
          INSERT OR IGNORE INTO crew_templates (name, purpose, fields_json, prompt_schema_json, created_at, updated_at)
          VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
        `);
        stmt.run(template.name, template.purpose, JSON.stringify(template.fields), JSON.stringify(template.promptSchema));
      }

      console.log('Crews templates seeded successfully');
    }

    if (process.env.VITE_FEATURE_PLANNER === 'true') {
      console.log('Seeding Planner data...');
      
      // Create demo tasks
      const tasks = [
        {
          title: 'Write blog post about AI trends',
          notes: 'Research latest developments in AI and write comprehensive analysis',
          priority: 'high',
          est_minutes: 120,
          due_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
          hard_deadline: false,
          tags: 'content, blog, ai'
        },
        {
          title: 'Review landing page copy',
          notes: 'Check the new landing page copy for tone and clarity',
          priority: 'med',
          est_minutes: 45,
          due_at: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
          hard_deadline: true,
          tags: 'review, landing-page'
        },
        {
          title: 'Create social media content',
          notes: 'Design and write social media posts for the week',
          priority: 'med',
          est_minutes: 90,
          due_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
          hard_deadline: false,
          tags: 'social-media, content'
        },
        {
          title: 'Update SEO keywords',
          notes: 'Research and update website SEO keywords based on latest trends',
          priority: 'low',
          est_minutes: 60,
          due_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
          hard_deadline: false,
          tags: 'seo, research'
        },
        {
          title: 'Prepare quarterly report',
          notes: 'Compile data and insights for Q4 content performance',
          priority: 'high',
          est_minutes: 180,
          due_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
          hard_deadline: true,
          tags: 'report, quarterly, urgent'
        },
        {
          title: 'Team meeting prep',
          notes: 'Prepare agenda and materials for weekly team sync',
          priority: 'med',
          est_minutes: 30,
          due_at: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
          hard_deadline: false,
          tags: 'meeting, team'
        }
      ];

      for (const task of tasks) {
        const stmt = db.prepare(`
          INSERT OR IGNORE INTO tasks (title, notes, priority, est_minutes, due_at, hard_deadline, status, tags, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, 'todo', ?, datetime('now'), datetime('now'))
        `);
        stmt.run(task.title, task.notes, task.priority, task.est_minutes, task.due_at, task.hard_deadline, task.tags);
      }

      // Create default work hours (9-5, Mon-Fri)
      const workHours = [
        { weekday: 1, start_time: '09:00', end_time: '17:00' }, // Monday
        { weekday: 2, start_time: '09:00', end_time: '17:00' }, // Tuesday
        { weekday: 3, start_time: '09:00', end_time: '17:00' }, // Wednesday
        { weekday: 4, start_time: '09:00', end_time: '17:00' }, // Thursday
        { weekday: 5, start_time: '09:00', end_time: '17:00' }, // Friday
      ];

      for (const wh of workHours) {
        const stmt = db.prepare(`
          INSERT OR IGNORE INTO work_hours (user_id, weekday, start_time, end_time, timezone)
          VALUES (1, ?, ?, ?, 'UTC')
        `);
        stmt.run(wh.weekday, wh.start_time, wh.end_time);
      }

      console.log('Planner data seeded successfully');
    }

    console.log('Labs data seeding completed');
  } catch (error) {
    console.error('Error seeding Labs data:', error);
  }
}

module.exports = seedLabsData;

// Run if called directly
if (require.main === module) {
  seedLabsData();
}
const { getDb } = require('./db');

function seedLabs() {
  const db = getDb();
  
  try {
    // Check if already seeded
    const existingTemplates = db.prepare('SELECT COUNT(*) as count FROM crew_templates').get();
    if (existingTemplates.count > 0) {
      console.log('Labs data already seeded');
      return;
    }

    // Seed Crew Templates
    const insertTemplate = db.prepare(`
      INSERT INTO crew_templates (name, purpose, fields_json, prompt_schema_json)
      VALUES (?, ?, ?, ?)
    `);

    insertTemplate.run(
      'Blog Post OS',
      'Generate comprehensive blog posts with SEO optimization',
      JSON.stringify(['topic', 'target_audience', 'tone', 'word_count']),
      JSON.stringify({
        system: 'You are a professional content writer specializing in blog posts.',
        user_template: 'Write a {word_count}-word blog post about {topic} for {target_audience} in a {tone} tone.'
      })
    );

    insertTemplate.run(
      'Landing Page',
      'Create high-converting landing page copy',
      JSON.stringify(['product_name', 'target_audience', 'key_benefits', 'cta']),
      JSON.stringify({
        system: 'You are a conversion copywriter specializing in landing pages.',
        user_template: 'Create landing page copy for {product_name} targeting {target_audience} with benefits: {key_benefits}. CTA: {cta}'
      })
    );

    insertTemplate.run(
      'Ad Set',
      'Generate multiple ad variations for A/B testing',
      JSON.stringify(['product', 'platform', 'audience', 'budget_range']),
      JSON.stringify({
        system: 'You are a digital marketing specialist creating ad copy.',
        user_template: 'Create 3 ad variations for {product} on {platform} targeting {audience} with budget {budget_range}'
      })
    );

    // Seed Tasks
    const insertTask = db.prepare(`
      INSERT INTO tasks (title, notes, priority, est_minutes, due_at, hard_deadline, status, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    insertTask.run(
      'Write Q4 marketing strategy',
      'Comprehensive strategy including channels, budget allocation, and KPIs',
      'high',
      180,
      tomorrow.toISOString(),
      1,
      'todo',
      'marketing,strategy'
    );

    insertTask.run(
      'Design new product mockups',
      'Create initial mockups for the new feature set',
      'high',
      120,
      nextWeek.toISOString(),
      0,
      'todo',
      'design,product'
    );

    insertTask.run(
      'Review competitor analysis',
      'Analyze top 5 competitors and document findings',
      'med',
      90,
      nextWeek.toISOString(),
      0,
      'doing',
      'research,analysis'
    );

    insertTask.run(
      'Update documentation',
      'Refresh API docs and user guides',
      'low',
      60,
      null,
      0,
      'todo',
      'docs,maintenance'
    );

    insertTask.run(
      'Team standup preparation',
      'Prepare agenda and review progress',
      'med',
      30,
      tomorrow.toISOString(),
      0,
      'todo',
      'meetings,planning'
    );

    insertTask.run(
      'Code review backlog',
      'Review pending PRs and provide feedback',
      'med',
      90,
      null,
      0,
      'blocked',
      'development,review'
    );

    console.log('Labs seed data created successfully');
  } catch (error) {
    console.error('Error seeding labs data:', error);
  }
}

module.exports = seedLabs;
