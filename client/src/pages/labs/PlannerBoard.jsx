
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LabsNav from '../../components/labs/LabsNav';

function PlannerBoard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);

  const columns = [
    { id: 'todo', title: 'To-do', color: 'bg-gray-500/20' },
    { id: 'doing', title: 'Doing', color: 'bg-blue-500/20' },
    { id: 'blocked', title: 'Blocked', color: 'bg-red-500/20' },
    { id: 'done', title: 'Done', color: 'bg-green-500/20' }
  ];

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await axios.get('/api/planner/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.patch(`/api/planner/tasks/${taskId}`, { status: newStatus });
      loadTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== newStatus) {
      updateTaskStatus(draggedTask.id, newStatus);
    }
    setDraggedTask(null);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'med': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      <LabsNav />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Task Board</h1>
              <p className="text-gray-400">Manage your tasks with drag & drop</p>
            </div>
            <Link
              to="/labs/planner/calendar"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Calendar View
            </Link>
          </div>
          <button
            onClick={() => setShowNewTaskModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            New Task
          </button>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((column) => (
            <div
              key={column.id}
              className="labs-kanban-column bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">{column.title}</h3>
                <span className="text-sm bg-white/10 px-2 py-1 rounded">
                  {tasks.filter(t => t.status === column.id).length}
                </span>
              </div>

              <div className="space-y-3">
                {tasks
                  .filter(task => task.status === column.id)
                  .map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                      className="labs-task-card bg-white/10 p-4 rounded-lg cursor-move hover:bg-white/15 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{task.title}</h4>
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
                      </div>
                      
                      {task.notes && (
                        <p className="text-xs text-gray-400 mb-2 line-clamp-2">{task.notes}</p>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{task.est_minutes}min</span>
                        {task.due_at && (
                          <span className={`${new Date(task.due_at) < new Date() ? 'text-red-400' : ''}`}>
                            {new Date(task.due_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      
                      {task.tags && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {task.tags.split(',').map((tag, index) => (
                            <span key={index} className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                
                {tasks.filter(t => t.status === column.id).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <div className={`w-12 h-12 ${column.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                    </div>
                    <p className="text-sm">Drop tasks here</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Task Modal */}
      {showNewTaskModal && (
        <NewTaskModal
          onClose={() => setShowNewTaskModal(false)}
          onCreated={() => {
            setShowNewTaskModal(false);
            loadTasks();
          }}
        />
      )}
    </div>
  );
}

function NewTaskModal({ onClose, onCreated }) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState('med');
  const [estMinutes, setEstMinutes] = useState(60);
  const [dueAt, setDueAt] = useState('');
  const [hardDeadline, setHardDeadline] = useState(false);
  const [tags, setTags] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/planner/tasks', {
        title,
        notes,
        priority,
        est_minutes: estMinutes,
        due_at: dueAt || null,
        hard_deadline: hardDeadline,
        tags
      });
      onCreated();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-white/10 rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create New Task</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white h-20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="low">Low</option>
                <option value="med">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Est. Minutes</label>
              <input
                type="number"
                value={estMinutes}
                onChange={(e) => setEstMinutes(parseInt(e.target.value))}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                min="15"
                step="15"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Due Date</label>
            <input
              type="datetime-local"
              value={dueAt}
              onChange={(e) => setDueAt(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="hardDeadline"
              checked={hardDeadline}
              onChange={(e) => setHardDeadline(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="hardDeadline" className="text-sm">Hard deadline (cannot be rescheduled)</label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
              placeholder="urgent, project-x, review"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PlannerBoard;
import React, { useState, useEffect } from 'react';
import { Plus, Clock, AlertCircle } from 'lucide-react';
import LabsNav from '../../components/labs/LabsNav';
import axios from 'axios';

function PlannerBoard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showNewTask, setShowNewTask] = useState(null);

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-gray-50' },
    { id: 'doing', title: 'In Progress', color: 'bg-blue-50' },
    { id: 'blocked', title: 'Blocked', color: 'bg-red-50' },
    { id: 'done', title: 'Done', color: 'bg-green-50' }
  ];

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.patch(`/api/tasks/${taskId}`, { status: newStatus });
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleAddTask = async (status) => {
    if (!newTaskTitle.trim()) return;
    
    try {
      const response = await axios.post('/api/tasks', {
        title: newTaskTitle,
        status,
        priority: 'med',
        est_minutes: 60
      });
      setTasks([...tasks, response.data]);
      setNewTaskTitle('');
      setShowNewTask(null);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'text-gray-600',
      med: 'text-blue-600',
      high: 'text-red-600'
    };
    return colors[priority] || 'text-gray-600';
  };

  const getPriorityIcon = (priority) => {
    if (priority === 'high') return '🔴';
    if (priority === 'med') return '🟡';
    return '🟢';
  };

  if (loading) {
    return (
      <div className="content">
        <div className="page-header">
          <h1 className="text-3xl font-bold text-gray-900">Task Board</h1>
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
        <h1 className="text-3xl font-bold text-gray-900">Task Board</h1>
        <LabsNav />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map(column => (
          <div key={column.id} className="labs-task-column">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                {column.title}
                <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-full">
                  {tasks.filter(task => task.status === column.id).length}
                </span>
              </h3>
              <button
                onClick={() => setShowNewTask(column.id)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {showNewTask === column.id && (
              <div className="labs-task-card mb-3">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Task title..."
                  className="w-full border-none outline-none bg-transparent font-medium"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddTask(column.id);
                    }
                  }}
                  onBlur={() => {
                    if (newTaskTitle.trim()) {
                      handleAddTask(column.id);
                    } else {
                      setShowNewTask(null);
                    }
                  }}
                  autoFocus
                />
              </div>
            )}

            <div className="space-y-3">
              {tasks
                .filter(task => task.status === column.id)
                .map(task => (
                  <div
                    key={task.id}
                    className="labs-task-card cursor-pointer"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', task.id);
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const draggedTaskId = e.dataTransfer.getData('text/plain');
                      if (draggedTaskId && draggedTaskId !== task.id.toString()) {
                        handleStatusChange(parseInt(draggedTaskId), column.id);
                      }
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 flex-1">{task.title}</h4>
                      <span className={getPriorityColor(task.priority)}>
                        {getPriorityIcon(task.priority)}
                      </span>
                    </div>
                    
                    {task.notes && (
                      <p className="text-sm text-gray-600 mb-2">{task.notes}</p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        <span>{task.est_minutes}m</span>
                      </div>
                      
                      {task.due_at && (
                        <div className="flex items-center gap-1">
                          {task.hard_deadline && <AlertCircle className="w-3 h-3 text-red-500" />}
                          <span className={task.hard_deadline ? 'text-red-500' : ''}>
                            {new Date(task.due_at).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {task.tags && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {task.tags.split(',').map(tag => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 rounded text-xs">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlannerBoard;
