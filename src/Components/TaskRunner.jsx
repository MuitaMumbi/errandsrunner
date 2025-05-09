import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./TaskRunnerDashboard.css"; // Assuming custom CSS for the dashboard

const TaskRunnerDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({
    status: "all", // All, pending, in_progress, completed, available
    sortBy: "due_date", // Sort by due date or priority
  });
  const [taskDetails, setTaskDetails] = useState(null); // For viewing task details
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(1); // Assume user ID is stored here for the runner
  const [userName, setUserName] = useState("John Doe"); // Placeholder for user's name

  // Fetch tasks
  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://Muita.pythonanywhere.com/api/gettasks", {
        params: filters,
      });
      setTasks(response.data.tasks);
    } catch (error) {
      toast.error("Error fetching tasks.");
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle status filter change
  const handleFilterChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle task acceptance (when the runner accepts a task)
  const handleAcceptTask = async (taskId) => {
    try {
      await axios.put("https://Muita.pythonanywhere.com/api/accepttask", {
        task_id: taskId,
        runner_id: userId,
      });
      toast.success("Task accepted!");
      fetchTasks(); // Refresh the task list to reflect the updated task status
    } catch (error) {
      toast.error("Error accepting task.");
      console.error("Error accepting task:", error);
    }
  };

  // Handle task status update (e.g., when a runner starts or completes a task)
  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      await axios.put("https://Muita.pythonanywhere.com/api/updatetask", {
        task_id: taskId,
        status: newStatus,
      });
      toast.success("Task status updated!");
      fetchTasks();
    } catch (error) {
      toast.error("Error updating task status.");
      console.error("Error updating task status:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <ToastContainer position="top-right" autoClose={5000} />

      {/* Main Header */}
      <div className="header-card">
        <div className="header-card-body">
          <h2>Task Runner Dashboard</h2>
        </div>
      </div>

      {/* Sidebar Card (Filters) */}
      <div className="filters-card">
        <div className="filters-card-header">
          <h3>Filters</h3>
        </div>
        <div className="filters-card-body">
          <div className="filter">
            <label>Status</label>
            <select name="status" value={filters.status} onChange={handleFilterChange}>
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="available">Available</option>
            </select>
          </div>
          <div className="filter">
            <label>Sort By</label>
            <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
              <option value="due_date">Due Date</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="task-list-container">
        {loading ? (
          <div>Loading tasks...</div>
        ) : (
          <div className="task-list">
            {tasks
              .filter(task => task.status !== 'accepted' || task.runner_id === userId) // Show tasks that are available for the runner
              .map((task) => (
                <div className="task-card" key={task.id} onClick={() => setTaskDetails(task)}>
                  <div className="task-card-header">
                    <h5>{task.errand_name}</h5>
                    <span className={`badge status-${task.status}`}>{task.status}</span>
                  </div>
                  <p className="task-description">{task.errand_desc}</p>
                  <div className="task-card-footer">
                    <span>Budget: Ksh {task.errand_cost}</span>
                    <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                  </div>
                  {task.status === "available" && (
                    <button className="accept-btn" onClick={() => handleAcceptTask(task.id)}>
                      Accept Task
                    </button>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Task Detail Modal */}
      {taskDetails && (
        <div className="task-modal">
          <div className="task-modal-content">
            <span className="close" onClick={() => setTaskDetails(null)}>
              &times;
            </span>
            <h3>{taskDetails.errand_name}</h3>
            <p>{taskDetails.errand_desc}</p>
            <p><strong>Budget:</strong> Ksh {taskDetails.errand_cost}</p>
            <p><strong>Status:</strong> {taskDetails.status}</p>

            <div className="task-actions">
              {taskDetails.status !== "completed" && (
                <button className="task-action-btn" onClick={() => handleTaskStatusChange(taskDetails.id, "completed")}>Mark as Completed</button>
              )}
              {taskDetails.status !== "in_progress" && taskDetails.status !== "completed" && (
                <button className="task-action-btn" onClick={() => handleTaskStatusChange(taskDetails.id, "in_progress")}>Start Task</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskRunnerDashboard;
