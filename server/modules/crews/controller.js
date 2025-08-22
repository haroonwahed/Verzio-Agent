
const crewsModel = require('./models');

// Mock content generation
const generateMockContent = (template, inputs) => {
  const mockContents = {
    'Blog Post OS': `# ${inputs.title || 'Sample Blog Post'}

${inputs.introduction || 'This is a compelling introduction that hooks the reader immediately.'}

## Key Points

- **Point 1**: ${inputs.keyPoint1 || 'First important insight'}
- **Point 2**: ${inputs.keyPoint2 || 'Second valuable point'}
- **Point 3**: ${inputs.keyPoint3 || 'Third actionable takeaway'}

## Conclusion

${inputs.conclusion || 'Wrap up with a strong call to action that encourages engagement.'}

*Generated with AI assistance*`,
    
    'Landing Page': `# ${inputs.headline || 'Convert More Visitors'}

## ${inputs.subheadline || 'Powerful solution that solves your biggest problem'}

${inputs.description || 'Detailed description of benefits and features that matter most to your target audience.'}

### Key Benefits:
- ✅ ${inputs.benefit1 || 'Save time and increase efficiency'}
- ✅ ${inputs.benefit2 || 'Reduce costs while improving quality'}
- ✅ ${inputs.benefit3 || 'Scale your operations effortlessly'}

**Ready to get started?** ${inputs.cta || 'Start your free trial today'}`,

    'Ad Set': `**Headline**: ${inputs.headline || 'Attention-Grabbing Headline'}

**Description**: ${inputs.description || 'Compelling description that drives action and creates urgency.'}

**Call to Action**: ${inputs.cta || 'Shop Now'}

**Target Audience**: ${inputs.audience || 'Ideal customers aged 25-45 interested in your product category'}

**Key Messages**:
- ${inputs.message1 || 'Primary value proposition'}
- ${inputs.message2 || 'Secondary benefit'}
- ${inputs.message3 || 'Urgency or social proof'}`
  };

  return mockContents[template.name] || `# Generated Content\n\nContent for ${template.name}\n\nInputs: ${JSON.stringify(inputs, null, 2)}`;
};

const createTemplate = async (req, res) => {
  try {
    const { name, purpose, fields_json, prompt_schema_json } = req.body;
    const result = crewsModel.createCrewTemplate(name, purpose, JSON.stringify(fields_json), JSON.stringify(prompt_schema_json));
    res.json({ id: result.lastInsertRowid, message: 'Template created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTemplates = async (req, res) => {
  try {
    const templates = crewsModel.getCrewTemplates();
    const parsedTemplates = templates.map(t => ({
      ...t,
      fields_json: JSON.parse(t.fields_json || '[]'),
      prompt_schema_json: JSON.parse(t.prompt_schema_json || '{}')
    }));
    res.json(parsedTemplates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCrew = async (req, res) => {
  try {
    const { name, template_id, purpose, inputs_json, tags } = req.body;
    const result = crewsModel.createCrew(name, template_id, purpose, JSON.stringify(inputs_json), tags);
    res.json({ id: result.lastInsertRowid, message: 'Crew created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCrews = async (req, res) => {
  try {
    const crews = crewsModel.getCrews();
    const parsedCrews = crews.map(c => ({
      ...c,
      inputs_json: JSON.parse(c.inputs_json || '{}')
    }));
    res.json(parsedCrews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const runCrew = async (req, res) => {
  try {
    const { id } = req.params;
    const crew = crewsModel.getCrewById(id);
    
    if (!crew) {
      return res.status(404).json({ error: 'Crew not found' });
    }

    // Update crew status to running
    crewsModel.updateCrewStatus(id, 'running');

    // Create run record
    const runResult = crewsModel.createCrewRun(id, crew.inputs_json, 0);
    const runId = runResult.lastInsertRowid;

    // Simulate AI generation
    const template = { name: crew.template_name };
    const inputs = JSON.parse(crew.inputs_json || '{}');
    const generatedContent = generateMockContent(template, inputs);
    
    // Mock SEO analysis
    const seoMeta = {
      title: inputs.title || 'Generated Content',
      description: inputs.description || 'AI generated content description',
      keywords: inputs.keywords || ['ai', 'content', 'generation'],
      score: Math.floor(Math.random() * 40) + 60 // 60-100
    };

    // Create draft
    const draftResult = crewsModel.createCrewDraft(id, generatedContent, JSON.stringify(seoMeta), seoMeta.score);

    // Update run with results
    const outputSnapshot = {
      draft_id: draftResult.lastInsertRowid,
      content_length: generatedContent.length,
      seo_score: seoMeta.score
    };
    
    const mockTokensUsed = Math.floor(generatedContent.length / 4); // Rough estimate
    crewsModel.updateCrewRun(runId, JSON.stringify(outputSnapshot), mockTokensUsed, 'done');

    // Update crew status
    crewsModel.updateCrewStatus(id, 'done');

    res.json({ 
      run_id: runId, 
      draft_id: draftResult.lastInsertRowid,
      message: 'Crew run completed successfully' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCrewDrafts = async (req, res) => {
  try {
    const { id } = req.params;
    const drafts = crewsModel.getCrewDrafts(id);
    const parsedDrafts = drafts.map(d => ({
      ...d,
      seo_meta_json: JSON.parse(d.seo_meta_json || '{}')
    }));
    res.json(parsedDrafts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTemplate,
  getTemplates,
  createCrew,
  getCrews,
  runCrew,
  getCrewDrafts
};
