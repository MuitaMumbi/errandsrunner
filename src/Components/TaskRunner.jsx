import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./TaskRunnerDashboard.css";

const TaskRunnerDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({
    status: "all", // All, pending, in_progress, completed, available
    sortBy: "due_date", // Sort by due date or priority
  });
  const [taskDetails, setTaskDetails] = useState(null); // For viewing task details
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState(""); // Placeholder for user's name
  const [user_id, setUserId] = useState(null); // Defines user_id
  
  // Fetch tasks
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.user_id) {
      setUserId(user.user_id);
      setUserName(user.username);
    } else {
      toast.error("User is not logged in.");
    }
    if (user_id) {
      fetchTasks();
    }
  }, [user_id, filters]); // Depend on both user_id and filters

  const fetchTasks = async () => {
    if (!user_id) {
      toast.error("User ID is missing.");
      return;
    }

    setLoading(true);
    try {
      console.log("Fetching tasks for user_id:", user_id); // Log to verify user_id
      const response = await axios.get("https://Muita.pythonanywhere.com/api/geterrands", {
        params: {
          runner_id: user_id,  // Passing runner_id as a query parameter
        },
      });

      const tasksData = response.data || [];
      setTasks(tasksData);
      console.log("Fetched errands:", response.data); // Log the response
    } catch (error) {
      console.error("Error fetching tasks:", error.response ? error.response.data : error);
      toast.error("Error fetching tasks.");
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
  const acceptTask = async (taskId) => {
    try {
      await axios.put("https://Muita.pythonanywhere.com/api/accepttask", {
        task_id: taskId,
        runner_id: user_id,
      });
      toast.success("Task accepted!");
      fetchTasks(); // Refresh the task list to reflect the updated task status
    } catch (error) {
      toast.error("Error accepting task.");
      console.error(error);
    }
  };

  // Handle task status update (e.g., when a runner starts or completes a task)
  const handleTaskStatusChange = async (taskId, newStatus) => {
  try {
    // Construct payload to update task status
    const payload = {
      task_id: taskId,
      status: newStatus,
      runner_id: user_id,  // Pass the current user as the runner
    };

    // Make API call to update the task status
    const response = await axios.put(
      "https://Muita.pythonanywhere.com/api/updatetaskstatus",
      payload
    );
    toast.success("Task status updated!");
    fetchTasks(); // Refresh the task list to reflect the updated task status
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
            {Array.isArray(tasks) && tasks.length > 0 ? (
              tasks
                .filter((task) => 
                  (task.status === "available" && (!task.accepted_by || task.accepted_by === '')) ||
                  task.accepted_by === user_id
                )
                .map((task) => (
                  <div className="task-card" key={task.errand_id} onClick={() => setTaskDetails(task)}>
                    <div className="task-card-header">
                      <h5>{task.errand_name}</h5>
                      <span className={`badge status-${task.status}`}>{task.status}</span>
                    </div>
                    <p className="task-description">{task.errand_desc}</p>

                    {/* Creator Info */}
                    <div className="task-creator-info">
                      <p><strong>Creator:</strong> {task.creator_name}</p>
                      <p><strong>Email:</strong> <a href={`mailto:${task.creator_email}`}>{task.creator_email}</a></p>
                      <p><strong>Phone:</strong> <a href={`tel:${task.creator_phone}`}>{task.creator_phone}</a></p>
                    </div>

                    <div className="task-card-footer">
                      <span>Budget: Ksh {task.errand_cost}</span>
                      <span>Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : "N/A"}</span>
                    </div>

                    {/* Accept Task button (only if the errand is not accepted) */}
                      {task.status === 'available' && (
                        <button onClick={() => acceptTask(task.errand_id)}>Accept Task</button>
                      )}
                    <button
                      className="message-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/chat?sender_id=${user_id}&receiver_id=${task.creator_id}`;
                      }}
                    >
                      Message Creator
                    </button>
                  </div>
                ))
            ) : (
              <p className="text-center">No tasks found.</p>
            )}
          </div>
        )}
      </div>

      {/* Task Detail Modal */}
      {taskDetails && (
        <div className="task-modal">
          <div className="task-modal-content">
            <span className="close" onClick={() => setTaskDetails(null)}>&times;</span>
            <h3>{taskDetails.errand_name}</h3>
            <p>{taskDetails.errand_desc}</p>
            <p><strong>Budget:</strong> Ksh {taskDetails.errand_cost}</p>
            <p><strong>Status:</strong> {taskDetails.status}</p>

            {/* Creator Info */}
            <p><strong>Creator:</strong> {taskDetails.creator_name}</p>
            <p><strong>Email:</strong> <a href={`mailto:${taskDetails.creator_email}`}>{taskDetails.creator_email}</a></p>
            <p><strong>Phone:</strong> <a href={`tel:${taskDetails.creator_phone}`}>{taskDetails.creator_phone}</a></p>

            {taskDetails.status !== "completed" && (
              <button 
                className="task-action-btn" 
                onClick={() => handleTaskStatusChange(taskDetails.errand_id, "completed")} 
                disabled={taskDetails.status === "completed"}
              >
                Mark as Completed
              </button>
            )}
            {taskDetails.status !== "in_progress" && taskDetails.status !== "completed" && (
              <button 
                className="task-action-btn" 
                onClick={() => handleTaskStatusChange(taskDetails.errand_id, "in_progress")}
                disabled={taskDetails.status === "in_progress"}
              >
                Start Task
              </button>
            )}
          </div>
          <button
            className="message-btn"
            onClick={() =>
              window.location.href = `/chat?sender_id=${user_id}&receiver_id=${taskDetails.creator_id}`
            }
          >
            Message Creator
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskRunnerDashboard;
