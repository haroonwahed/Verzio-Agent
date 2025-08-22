const crewsModel = require('./models');

// Mock content generation
const generateMockContent = (crewName, topic) => {
  const templates = {
    'Blog Content Team': {
      title: `The Ultimate Guide to ${topic}`,
      content_md: `# The Ultimate Guide to ${topic}

## Introduction

${topic} has become increasingly important in today's digital landscape. This comprehensive guide will walk you through everything you need to know.

## Key Benefits

- **Improved efficiency**: Streamline your workflow
- **Better results**: Achieve your goals faster
- **Cost savings**: Reduce operational expenses

## Best Practices

1. Start with proper planning
2. Focus on quality over quantity
3. Monitor and adjust regularly

## Conclusion

Implementing these strategies for ${topic} will help you achieve better results and stay ahead of the competition.`,
      content_html: `<h1>The Ultimate Guide to ${topic}</h1>
<h2>Introduction</h2>
<p>${topic} has become increasingly important in today's digital landscape. This comprehensive guide will walk you through everything you need to know.</p>
<h2>Key Benefits</h2>
<ul>
<li><strong>Improved efficiency</strong>: Streamline your workflow</li>
<li><strong>Better results</strong>: Achieve your goals faster</li>
<li><strong>Cost savings</strong>: Reduce operational expenses</li>
</ul>
<h2>Best Practices</h2>
<ol>
<li>Start with proper planning</li>
<li>Focus on quality over quantity</li>
<li>Monitor and adjust regularly</li>
</ol>
<h2>Conclusion</h2>
<p>Implementing these strategies for ${topic} will help you achieve better results and stay ahead of the competition.</p>`,
      score: Math.floor(Math.random() * 20) + 80
    },
    'Social Media Team': {
      title: `${topic} Social Campaign`,
      content_md: `# ${topic} Social Media Campaign

## Campaign Overview
Engaging social media strategy for ${topic}

## Content Pillars
- Educational content
- Behind-the-scenes
- User-generated content
- Product highlights

## Post Ideas
1. **Tip Tuesday**: Share quick tips about ${topic}
2. **Feature Friday**: Highlight key features
3. **Monday Motivation**: Inspirational content

## Hashtags
#${topic.replace(/\s+/g, '')} #Innovation #Digital #Growth`,
      content_html: `<h1>${topic} Social Media Campaign</h1>
<h2>Campaign Overview</h2>
<p>Engaging social media strategy for ${topic}</p>
<h2>Content Pillars</h2>
<ul>
<li>Educational content</li>
<li>Behind-the-scenes</li>
<li>User-generated content</li>
<li>Product highlights</li>
</ul>
<h2>Post Ideas</h2>
<ol>
<li><strong>Tip Tuesday</strong>: Share quick tips about ${topic}</li>
<li><strong>Feature Friday</strong>: Highlight key features</li>
<li><strong>Monday Motivation</strong>: Inspirational content</li>
</ol>
<h2>Hashtags</h2>
<p>#${topic.replace(/\s+/g, '')} #Innovation #Digital #Growth</p>`,
      score: Math.floor(Math.random() * 20) + 75
    }
  };

  return templates[crewName] || templates['Blog Content Team'];
};

const getCrews = (req, res) => {
  try {
    const crews = crewsModel.getCrews();
    res.json(crews);
  } catch (error) {
    console.error('Error fetching crews:', error);
    res.status(500).json({ error: 'Failed to fetch crews' });
  }
};

const createCrew = (req, res) => {
  try {
    const { name, description, agents } = req.body;
    const userId = req.user?.id || 1;

    const result = crewsModel.createCrew(name, description, agents, userId);
    res.status(201).json({ 
      id: result.lastInsertRowid,
      message: 'Crew created successfully' 
    });
  } catch (error) {
    console.error('Error creating crew:', error);
    res.status(500).json({ error: 'Failed to create crew' });
  }
};

const getCrewTemplates = (req, res) => {
  try {
    const templates = crewsModel.getCrewTemplates();
    res.json(templates);
  } catch (error) {
    console.error('Error fetching crew templates:', error);
    res.status(500).json({ error: 'Failed to fetch crew templates' });
  }
};

const runCrew = (req, res) => {
  try {
    const { id } = req.params;
    const { topic } = req.body;

    const crew = crewsModel.getCrewById(id);
    if (!crew) {
      return res.status(404).json({ error: 'Crew not found' });
    }

    // Generate mock content
    const content = generateMockContent(crew.name, topic || 'Digital Marketing');

    // Save as draft
    const draftResult = crewsModel.createCrewDraft(
      id,
      content.title,
      content.content_md,
      content.content_html,
      content.score
    );

    res.json({
      message: 'Crew execution completed',
      draft_id: draftResult.lastInsertRowid,
      title: content.title,
      score: content.score
    });
  } catch (error) {
    console.error('Error running crew:', error);
    res.status(500).json({ error: 'Failed to run crew' });
  }
};

const getCrewDrafts = (req, res) => {
  try {
    const { id } = req.params;
    const drafts = crewsModel.getCrewDrafts(id);
    res.json(drafts);
  } catch (error) {
    console.error('Error fetching crew drafts:', error);
    res.status(500).json({ error: 'Failed to fetch crew drafts' });
  }
};

module.exports = {
  getCrews,
  createCrew,
  getCrewTemplates,
  runCrew,
  getCrewDrafts
};