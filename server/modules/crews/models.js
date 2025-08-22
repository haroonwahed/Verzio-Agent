
const { getDb } = require('../../db');

const getCrews = () => {
  const db = getDb();
  return db.prepare('SELECT * FROM crews ORDER BY created_at DESC').all();
};

const createCrew = (name, description, agents, userId) => {
  const db = getDb();
  return db.prepare(`
    INSERT INTO crews (name, description, agents, user_id)
    VALUES (?, ?, ?, ?)
  `).run(name, description, JSON.stringify(agents), userId);
};

const getCrewById = (id) => {
  const db = getDb();
  const crew = db.prepare('SELECT * FROM crews WHERE id = ?').get(id);
  if (crew && crew.agents) {
    crew.agents = JSON.parse(crew.agents);
  }
  return crew;
};

const getCrewTemplates = () => {
  return [
    {
      id: 'blog-writers',
      name: 'Blog Content Team',
      description: 'Research, write, and optimize blog posts',
      agents: [
        { role: 'researcher', name: 'Research Specialist' },
        { role: 'writer', name: 'Content Writer' },
        { role: 'editor', name: 'Editor' }
      ]
    },
    {
      id: 'social-media',
      name: 'Social Media Team',
      description: 'Create engaging social media content',
      agents: [
        { role: 'strategist', name: 'Social Media Strategist' },
        { role: 'creator', name: 'Content Creator' },
        { role: 'scheduler', name: 'Post Scheduler' }
      ]
    },
    {
      id: 'product-launch',
      name: 'Product Launch Team',
      description: 'Coordinate product launch activities',
      agents: [
        { role: 'manager', name: 'Launch Manager' },
        { role: 'marketer', name: 'Marketing Specialist' },
        { role: 'analyst', name: 'Data Analyst' }
      ]
    }
  ];
};

const getCrewDrafts = (crewId) => {
  const db = getDb();
  return db.prepare('SELECT * FROM crew_drafts WHERE crew_id = ? ORDER BY created_at DESC').all(crewId);
};

const createCrewDraft = (crewId, title, contentMd, contentHtml, score) => {
  const db = getDb();
  return db.prepare(`
    INSERT INTO crew_drafts (crew_id, title, content_md, content_html, score)
    VALUES (?, ?, ?, ?, ?)
  `).run(crewId, title, contentMd, contentHtml, score);
};

module.exports = {
  getCrews,
  createCrew,
  getCrewById,
  getCrewTemplates,
  getCrewDrafts,
  createCrewDraft
};
