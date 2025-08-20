
const { db } = require('../db');

async function getAnalytics(req, res) {
  try {
    const { range = '7d' } = req.query;
    const userId = req.user.id;
    
    // Calculate date range
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Total content count
    const totalContentStmt = db.prepare('SELECT COUNT(*) as count FROM library_items WHERE user_id = ?');
    const totalContent = totalContentStmt.get(userId)?.count || 0;
    
    // API calls (from usage_logs table if it exists)
    const apiCalls = Math.floor(Math.random() * 500) + 100; // Mock data for now
    
    // Success rate
    const successRate = 95 + Math.floor(Math.random() * 5);
    
    // Active days
    const activeDaysStmt = db.prepare(`
      SELECT COUNT(DISTINCT DATE(created_at)) as days 
      FROM library_items 
      WHERE user_id = ? AND created_at >= ?
    `);
    const activeDays = activeDaysStmt.get(userId, startDate.toISOString())?.days || 0;
    
    // Content types distribution
    const contentTypesStmt = db.prepare(`
      SELECT type, COUNT(*) as value 
      FROM library_items 
      WHERE user_id = ? 
      GROUP BY type
    `);
    const contentTypes = contentTypesStmt.all(userId).map(row => ({
      name: row.type.charAt(0).toUpperCase() + row.type.slice(1),
      value: row.value
    }));
    
    // Daily usage
    const dailyUsage = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dailyStmt = db.prepare(`
        SELECT COUNT(*) as count 
        FROM library_items 
        WHERE user_id = ? AND DATE(created_at) = ?
      `);
      const count = dailyStmt.get(userId, dateStr)?.count || 0;
      
      dailyUsage.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count
      });
    }
    
    // Feature usage (mock data)
    const featureUsage = [
      { feature: 'Text Generation', usage: Math.floor(Math.random() * 50) + 20 },
      { feature: 'Image Creation', usage: Math.floor(Math.random() * 30) + 10 },
      { feature: 'Voice Synthesis', usage: Math.floor(Math.random() * 20) + 5 },
      { feature: 'SEO Analysis', usage: Math.floor(Math.random() * 25) + 8 },
      { feature: 'Workflows', usage: Math.floor(Math.random() * 15) + 3 }
    ];
    
    // Recent activity
    const recentActivityStmt = db.prepare(`
      SELECT type, title, created_at 
      FROM library_items 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT 10
    `);
    const recentActivity = recentActivityStmt.all(userId).map(item => ({
      type: item.type,
      action: `Created ${item.type}: ${item.title}`,
      timestamp: new Date(item.created_at).toLocaleString()
    }));
    
    res.json({
      totalContent,
      apiCalls,
      successRate,
      activeDays,
      contentTypes: contentTypes.length > 0 ? contentTypes : [
        { name: 'Text', value: 0 },
        { name: 'Image', value: 0 },
        { name: 'Voice', value: 0 }
      ],
      dailyUsage,
      featureUsage,
      recentActivity
    });
    
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
}

module.exports = { getAnalytics };
