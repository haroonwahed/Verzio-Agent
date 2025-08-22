
const db = require('../../db');

// CrewTemplate model
const createCrewTemplate = (name, purpose, fieldsJson, promptSchemaJson) => {
  const stmt = db.prepare(`
    INSERT INTO crew_templates (name, purpose, fields_json, prompt_schema_json, created_at, updated_at)
    VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
  `);
  return stmt.run(name, purpose, fieldsJson, promptSchemaJson);
};

const getCrewTemplates = () => {
  const stmt = db.prepare('SELECT * FROM crew_templates ORDER BY created_at DESC');
  return stmt.all();
};

const getCrewTemplateById = (id) => {
  const stmt = db.prepare('SELECT * FROM crew_templates WHERE id = ?');
  return stmt.get(id);
};

// Crew model
const createCrew = (name, templateId, purpose, inputsJson, tags = '') => {
  const stmt = db.prepare(`
    INSERT INTO crews (name, template_id, purpose, inputs_json, status, tags, created_at, updated_at)
    VALUES (?, ?, ?, ?, 'draft', ?, datetime('now'), datetime('now'))
  `);
  return stmt.run(name, templateId, purpose, inputsJson, tags);
};

const getCrews = () => {
  const stmt = db.prepare(`
    SELECT c.*, ct.name as template_name 
    FROM crews c 
    LEFT JOIN crew_templates ct ON c.template_id = ct.id 
    ORDER BY c.created_at DESC
  `);
  return stmt.all();
};

const getCrewById = (id) => {
  const stmt = db.prepare(`
    SELECT c.*, ct.name as template_name, ct.fields_json, ct.prompt_schema_json
    FROM crews c 
    LEFT JOIN crew_templates ct ON c.template_id = ct.id 
    WHERE c.id = ?
  `);
  return stmt.get(id);
};

const updateCrewStatus = (id, status) => {
  const stmt = db.prepare('UPDATE crews SET status = ?, updated_at = datetime("now") WHERE id = ?');
  return stmt.run(status, id);
};

// CrewDraft model
const createCrewDraft = (crewId, contentMd, seoMetaJson, score = 0) => {
  const stmt = db.prepare(`
    INSERT INTO crew_drafts (crew_id, content_md, seo_meta_json, score, created_at)
    VALUES (?, ?, ?, ?, datetime('now'))
  `);
  return stmt.run(crewId, contentMd, seoMetaJson, score);
};

const getCrewDrafts = (crewId) => {
  const stmt = db.prepare('SELECT * FROM crew_drafts WHERE crew_id = ? ORDER BY created_at DESC');
  return stmt.all(crewId);
};

// CrewRun model
const createCrewRun = (crewId, inputSnapshotJson, tokensUsed = 0) => {
  const stmt = db.prepare(`
    INSERT INTO crew_runs (crew_id, input_snapshot_json, output_snapshot_json, tokens_used, status, created_at)
    VALUES (?, ?, '{}', ?, 'queued', datetime('now'))
  `);
  return stmt.run(crewId, inputSnapshotJson, tokensUsed);
};

const updateCrewRun = (id, outputSnapshotJson, tokensUsed, status) => {
  const stmt = db.prepare(`
    UPDATE crew_runs 
    SET output_snapshot_json = ?, tokens_used = ?, status = ?
    WHERE id = ?
  `);
  return stmt.run(outputSnapshotJson, tokensUsed, status, id);
};

const getCrewRuns = (crewId) => {
  const stmt = db.prepare('SELECT * FROM crew_runs WHERE crew_id = ? ORDER BY created_at DESC');
  return stmt.all(crewId);
};

module.exports = {
  createCrewTemplate,
  getCrewTemplates,
  getCrewTemplateById,
  createCrew,
  getCrews,
  getCrewById,
  updateCrewStatus,
  createCrewDraft,
  getCrewDrafts,
  createCrewRun,
  updateCrewRun,
  getCrewRuns
};
