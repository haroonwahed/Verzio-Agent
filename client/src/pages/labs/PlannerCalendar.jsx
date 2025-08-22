
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LabsNav from '../../components/labs/LabsNav';

function PlannerCalendar() {
  const [tasks, setTasks] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [proposedBlocks, setProposedBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [isPlanning, setIsPlanning] = useState(false);

  useEffect(() => {
    loadData();
  }, [currentWeek]);

  const loadData = async () => {
    try {
      const startOfWeek = new Date(currentWeek);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);

      const [tasksRes, blocksRes] = await Promise.all([
        axios.get('/api/planner/tasks'),
        axios.get('/api/planner/blocks', {
          params: {
            start_date: startOfWeek.toISOString(),
            end_date: endOfWeek.toISOString()
          }
        })
      ]);

      setTasks(tasksRes.data);
      setBlocks(blocksRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSchedule = async () => {
    setIsPlanning(true);
    try {
      const response = await axios.post('/api/planner/scheduler/plan');
      setProposedBlocks(response.data.proposed_blocks);
    } catch (error) {
      console.error('Error generating schedule:', error);
    } finally {
      setIsPlanning(false);
    }
  };

  const commitSchedule = async () => {
    try {
      await axios.post('/api/planner/blocks/commit', { blocks: proposedBlocks });
      setProposedBlocks([]);
      loadData();
    } catch (error) {
      console.error('Error committing schedule:', error);
    }
  };

  const getWeekDays = () => {
    const startOfWeek = new Date(currentWeek);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getBlocksForDay = (day) => {
    const dayStr = day.toISOString().split('T')[0];
    return [...blocks, ...proposedBlocks].filter(block => 
      block.starts_at.startsWith(dayStr)
    );
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500/80';
      case 'med': return 'bg-yellow-500/80';
      case 'low': return 'bg-green-500/80';
      default: return 'bg-gray-500/80';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
        <LabsNav />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  const weekDays = getWeekDays();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      <LabsNav />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Calendar</h1>
              <p className="text-gray-400">Schedule and manage your time blocks</p>
            </div>
            <Link
              to="/labs/planner/board"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Board View
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentWeek(new Date(currentWeek.getTime() - 7 * 24 * 60 * 60 * 1000))}
              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg transition-colors"
            >
              ←
            </button>
            <span className="font-medium">
              {weekDays[0].toLocaleDateString()} - {weekDays[6].toLocaleDateString()}
            </span>
            <button
              onClick={() => setCurrentWeek(new Date(currentWeek.getTime() + 7 * 24 * 60 * 60 * 1000))}
              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg transition-colors"
            >
              →
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={generateSchedule}
                disabled={isPlanning}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                {isPlanning ? 'Planning...' : 'Auto-schedule'}
              </button>
              
              {proposedBlocks.length > 0 && (
                <>
                  <button
                    onClick={commitSchedule}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Commit Plan ({proposedBlocks.length} blocks)
                  </button>
                  <button
                    onClick={() => setProposedBlocks([])}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Scheduled</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500/50 border border-purple-500 rounded"></div>
                <span>Proposed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="labs-calendar-grid bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden">
          <div className="grid grid-cols-8 border-b border-white/10">
            <div className="p-4 font-medium text-center bg-white/5">Time</div>
            {weekDays.map((day) => (
              <div key={day.toISOString()} className="p-4 font-medium text-center">
                <div>{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                <div className="text-sm text-gray-400">{day.getDate()}</div>
              </div>
            ))}
          </div>

          {/* Time slots */}
          <div className="grid grid-cols-8">
            {/* Time column */}
            <div className="bg-white/5">
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} className="h-16 border-b border-white/10 flex items-center justify-center text-sm text-gray-400">
                  {`${i + 8}:00`}
                </div>
              ))}
            </div>

            {/* Day columns */}
            {weekDays.map((day) => (
              <div key={day.toISOString()} className="border-l border-white/10 relative">
                {Array.from({ length: 12 }, (_, i) => (
                  <div key={i} className="h-16 border-b border-white/10"></div>
                ))}
                
                {/* Blocks for this day */}
                {getBlocksForDay(day).map((block, index) => {
                  const startTime = new Date(block.starts_at);
                  const endTime = new Date(block.ends_at);
                  const startHour = startTime.getHours() + startTime.getMinutes() / 60;
                  const duration = (endTime - startTime) / (1000 * 60 * 60); // hours
                  
                  const top = Math.max(0, (startHour - 8) * 4); // 4rem per hour
                  const height = duration * 4; // 4rem per hour
                  
                  const isProposed = proposedBlocks.includes(block);
                  
                  return (
                    <div
                      key={`${block.task_id}-${index}`}
                      className={`absolute left-1 right-1 rounded p-2 text-xs ${
                        isProposed 
                          ? 'bg-purple-500/50 border border-purple-500 border-dashed' 
                          : getPriorityColor(block.priority)
                      }`}
                      style={{
                        top: `${top}rem`,
                        height: `${Math.max(height, 1)}rem`
                      }}
                    >
                      <div className="font-medium truncate">{block.task_title}</div>
                      <div className="text-xs opacity-75">
                        {formatTime(block.starts_at)} - {formatTime(block.ends_at)}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4">
            <h3 className="font-medium mb-2">Tasks</h3>
            <div className="text-2xl font-bold">{tasks.filter(t => ['todo', 'doing'].includes(t.status)).length}</div>
            <div className="text-sm text-gray-400">Pending tasks</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4">
            <h3 className="font-medium mb-2">Scheduled</h3>
            <div className="text-2xl font-bold">{blocks.length}</div>
            <div className="text-sm text-gray-400">Time blocks</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4">
            <h3 className="font-medium mb-2">Utilization</h3>
            <div className="text-2xl font-bold">
              {blocks.length > 0 ? Math.round((blocks.length / (7 * 8)) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-400">Week capacity</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlannerCalendar;

function PlannerCalendar() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [eventBlocks, setEventBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoScheduling, setAutoScheduling] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, blocksRes] = await Promise.all([
        axios.get('/api/tasks'),
        axios.get('/api/blocks')
      ]);
      setTasks(tasksRes.data);
      setEventBlocks(blocksRes.data || []);
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWeekDays = () => {
    const days = [];
    const startOfWeek = new Date(currentWeek);
    startOfWeek.setDate(currentWeek.getDate() - currentWeek.getDay() + 1); // Monday

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const navigateWeek = (direction) => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction * 7));
    setCurrentWeek(newWeek);
  };

  const handleAutoSchedule = async () => {
    setAutoScheduling(true);
    try {
      const response = await axios.post('/api/scheduler/plan');
      setEventBlocks(response.data);
    } catch (error) {
      console.error('Error auto-scheduling:', error);
    } finally {
      setAutoScheduling(false);
    }
  };

  const handleCommitPlan = async () => {
    try {
      await axios.post('/api/blocks/commit', { blocks: eventBlocks });
      alert('Schedule committed successfully!');
    } catch (error) {
      console.error('Error committing plan:', error);
      alert('Error committing plan');
    }
  };

  const getTasksForDay = (day) => {
    const dayStr = day.toISOString().split('T')[0];
    return eventBlocks.filter(block => {
      const blockDay = new Date(block.starts_at).toISOString().split('T')[0];
      return blockDay === dayStr;
    });
  };

  const getTaskById = (taskId) => {
    return tasks.find(task => task.id === taskId);
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const weekDays = getWeekDays();

  if (loading) {
    return (
      <div className="content">
        <div className="page-header">
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          <LabsNav />
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <div className="page-header">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          <div className="toolbar">
            <button
              onClick={handleAutoSchedule}
              disabled={autoScheduling}
              className="btn-primary flex items-center gap-2"
            >
              {autoScheduling ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Scheduling...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Auto-schedule
                </>
              )}
            </button>
            <button
              onClick={handleCommitPlan}
              className="btn-primary flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Commit Plan
            </button>
            <button className="btn-primary flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Work Hours
            </button>
          </div>
        </div>
        <LabsNav />
      </div>

      {/* Week Navigation */}
      <div className="panel p-4 mb-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateWeek(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <h2 className="text-lg font-semibold">
            {weekDays[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {' '}
            {weekDays[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </h2>
          
          <button
            onClick={() => navigateWeek(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="labs-calendar-grid">
        {weekDays.map(day => (
          <div key={day.toISOString()} className="labs-calendar-day">
            <div className="font-semibold text-sm text-gray-900 mb-2">
              {day.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
            </div>
            
            <div className="space-y-1">
              {getTasksForDay(day).map(block => {
                const task = getTaskById(block.task_id);
                if (!task) return null;
                
                return (
                  <div
                    key={block.id}
                    className="labs-time-block"
                    style={{
                      top: `${(new Date(block.starts_at).getHours() - 9) * 20 + 40}px`,
                      height: `${(new Date(block.ends_at) - new Date(block.starts_at)) / (1000 * 60) * 20 / 60}px`
                    }}
                    title={`${task.title} (${formatTime(block.starts_at)} - ${formatTime(block.ends_at)})`}
                  >
                    <div className="font-medium text-xs">{task.title}</div>
                    <div className="text-xs opacity-90">
                      {formatTime(block.starts_at)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Unscheduled Tasks */}
      <div className="panel p-6 mt-6">
        <h3 className="font-semibold text-gray-900 mb-4">Unscheduled Tasks</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {tasks
            .filter(task => task.status !== 'done' && !eventBlocks.some(block => block.task_id === task.id))
            .map(task => (
              <div key={task.id} className="labs-task-card">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-sm">{task.title}</h4>
                  <span className="text-xs text-gray-500">{task.est_minutes}m</span>
                </div>
                {task.due_at && (
                  <div className="text-xs text-gray-500">
                    Due: {new Date(task.due_at).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default PlannerCalendar;
