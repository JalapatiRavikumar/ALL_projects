import React, { useState } from 'react';
import { Trash2, Clock, Shield, ChevronRight, ChevronLeft } from 'lucide-react';

const TaskCard = ({ task, onUpdate, onDelete }) => {
  const [loading, setLoading] = useState(false);

  const priorityColors = {
    LOW: 'bg-gray-200 text-gray-700',
    MEDIUM: 'bg-blue-200 text-blue-700',
    HIGH: 'bg-orange-200 text-orange-700',
    URGENT: 'bg-red-200 text-red-700'
  };

  const handleStatusChange = async (newStatus) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...task,
          status: newStatus
        })
      });

      if (response.ok) {
        const updatedTask = await response.json();
        onUpdate(updatedTask);
      }
    } catch (err) {
      console.error('Failed to update task:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/tasks/${task.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        onDelete(task.id);
      }
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const canMoveLeft = task.status !== 'TODO';
  const canMoveRight = task.status !== 'DONE';


  const moveLeft = () => {
    if (task.status === 'IN_PROGRESS') handleStatusChange('TODO');
    if (task.status === 'DONE') handleStatusChange('IN_PROGRESS');
  };

  const moveRight = () => {
    if (task.status === 'TODO') handleStatusChange('IN_PROGRESS');
    if (task.status === 'IN_PROGRESS') handleStatusChange('DONE');
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-800 flex-1">{task.title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mb-3">{task.description}</p>
      )}

      {task.estimatedTime && (
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <Clock size={14} />
          <span>{task.estimatedTime}</span>
        </div>
      )}

      {task.blockchainHash && (
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
          <Shield size={14} />
          <span className="truncate" title={task.blockchainHash}>
            Hash: {task.blockchainHash.substring(0, 12)}...
          </span>
        </div>
      )}

      <div className="flex justify-between items-center pt-3 border-t">
        <div className="flex gap-2">
          {canMoveLeft && (
            <button
              onClick={moveLeft}
              disabled={loading}
              className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
              title="Move Left"
            >
              <ChevronLeft size={18} />
            </button>
          )}
          {canMoveRight && (
            <button
              onClick={moveRight}
              disabled={loading}
              className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
              title="Move Right"
            >
              <ChevronRight size={18} />
            </button>
          )}
        </div>

        <button
          onClick={handleDelete}
          className="text-red-500 hover:bg-red-50 p-1 rounded transition"
          title="Delete Task"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
