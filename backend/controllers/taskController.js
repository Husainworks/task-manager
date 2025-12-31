const axios = require("axios");
const User = require("../models/User");
const Task = require("../models/Task");
const API_PATHS = require("../config/apiPaths");

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8000";

const getDashboardData = async (req, res) => {
  try {
    const team = req.user.team; // Accessing team as a string from the logged-in user

    // Fetch Statistics for the user's team
    const totalTasks = await Task.countDocuments({ team });
    const pendingTasks = await Task.countDocuments({ team, status: "Pending" });
    const completedTasks = await Task.countDocuments({
      team,
      status: "Completed",
    });
    const overdueTasks = await Task.countDocuments({
      team,
      status: { $ne: "Completed" },
      dueDate: { $lt: new Date() },
    });

    // Task Status Distribution (by team)
    const taskStatuses = ["Pending", "Completed", "In Progress"];
    const taskDistributionRaw = await Task.aggregate([
      { $match: { team } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const taskDistribution = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, "");
      acc[formattedKey] =
        taskDistributionRaw.find((item) => item._id === status)?.count || 0;
      return acc;
    }, {});

    taskDistribution["All"] = totalTasks;

    // Task Priority Distribution (by team)
    const taskPriorities = ["Low", "Medium", "High"];
    const taskPriorityLevelsRaw = await Task.aggregate([
      { $match: { team } },
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);

    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
      acc[priority] =
        taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
      return acc;
    }, {});

    // Fetch recent 10 tasks for the team
    const recentTasks = await Task.find({ team })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority dueDate createdAt");

    // Respond with all data
    res.status(200).json({
      statistics: {
        totalTasks,
        pendingTasks,
        completedTasks,
        overdueTasks,
      },
      charts: {
        taskDistribution,
        taskPriorityLevels,
      },
      recentTasks,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const getUserDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;
    const team = req.user.team;

    // Fetching statistics for tasks assigned to this user within their team
    const totalTasks = await Task.countDocuments({ assignedTo: userId, team });
    const pendingTasks = await Task.countDocuments({
      assignedTo: userId,
      team,
      status: "Pending",
    });
    const completedTasks = await Task.countDocuments({
      assignedTo: userId,
      team,
      status: "Completed",
    });
    const overdueTasks = await Task.countDocuments({
      assignedTo: userId,
      team,
      status: { $ne: "Completed" },
      dueDate: { $lt: new Date() },
    });

    // Task Distribution by status
    const taskStatuses = ["Pending", "In Progress", "Completed"];
    const taskDistributionRaw = await Task.aggregate([
      { $match: { assignedTo: userId, team } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const taskDistribution = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, "");
      acc[formattedKey] =
        taskDistributionRaw.find((item) => item._id === status)?.count || 0;
      return acc;
    }, {});
    taskDistribution["All"] = totalTasks;

    // Task Distribution by priority
    const taskPriorities = ["Low", "Medium", "High"];
    const taskPriorityLevelsRaw = await Task.aggregate([
      { $match: { assignedTo: userId, team } },
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]);

    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
      acc[priority] =
        taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
      return acc;
    }, {});

    // Fetch Recent 10 tasks of the logged-in user within their team
    const recentTasks = await Task.find({ assignedTo: userId, team })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority dueDate createdAt");

    res.status(200).json({
      statistics: {
        totalTasks,
        pendingTasks,
        completedTasks,
        overdueTasks,
      },
      charts: {
        taskDistribution,
        taskPriorityLevels,
      },
      recentTasks,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

//Get All Tasks ( Admin: all, User: Assigned)
const getTasks = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};

    if (status) {
      filter.status = status;
    }

    // Add team-based filtering
    filter.team = req.user.team;

    let tasks;

    if (req.user.role === "admin") {
      tasks = await Task.find(filter).populate(
        "assignedTo",
        "name email profileImageUrl"
      );
    } else {
      tasks = await Task.find({
        ...filter,
        assignedTo: req.user._id,
      }).populate("assignedTo", "name email profileImageUrl");
    }

    // Add Completed todoChecklist count to each task
    tasks = await Promise.all(
      tasks.map(async (task) => {
        const completedCount = task.todoChecklist.filter(
          (item) => item.completed
        ).length;
        return { ...task._doc, completedTodoCount: completedCount };
      })
    );

    // Status Summary Counts
    const allTasks = await Task.countDocuments(filter);

    const pendingTasks = await Task.countDocuments({
      ...filter,
      status: "Pending",
    });

    const inProgressTasks = await Task.countDocuments({
      ...filter,
      status: "In Progress",
    });

    const completedTasks = await Task.countDocuments({
      ...filter,
      status: "Completed",
    });

    res.json({
      tasks,
      tasksSummary: {
        all: allTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

//Get Task by ID
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id).populate(
      "assignedTo",
      "name email profileImageUrl"
    );

    if (!task) {
      return res.status(404).json({ message: "No task found" });
    }

    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

//Create a Task (Admin Only)
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      attachments,
      todoChecklist,
    } = req.body;

    if (!Array.isArray(assignedTo)) {
      return res.status(400).json({
        message: "assignedTo must be an array of user IDs",
      });
    }

    const adminUser = await User.findById(req.user._id);
    if (!adminUser) {
      return res.status(404).json({ message: "Admin user not found" });
    }

    // Include token in headers
    const apiUrl = `${API_BASE_URL}${API_PATHS.USERS.GET_TEAM_MEMBERS(
      req.user._id
    )}`;
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: req.headers.authorization, // Forward the same token
      },
    });

    const teamMembers = response.data;
    const teamMemberIds = teamMembers.map((member) => member._id.toString());

    const invalidMembers = assignedTo.filter(
      (userId) => !teamMemberIds.includes(userId.toString())
    );

    if (invalidMembers.length > 0) {
      return res.status(400).json({
        message: "One or more assigned users are not members of your team",
        invalidMembers,
      });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      createdBy: req.user._id,
      attachments,
      todoChecklist,
      company: adminUser.company,
      team: adminUser.team,
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("Create Task Error:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

//Update Task details
const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const {
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      attachments,
      todoChecklist,
    } = req.body;

    const adminUser = await User.findById(req.user._id);
    if (!adminUser) {
      return res.status(404).json({ message: "Admin user not found" });
    }

    // Get team members via internal API with auth header
    const apiUrl = `${API_BASE_URL}${API_PATHS.USERS.GET_TEAM_MEMBERS(
      req.user._id
    )}`;
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: req.headers.authorization,
      },
    });

    const teamMembers = response.data;
    const teamMemberIds = teamMembers.map((member) => member._id.toString());

    if (assignedTo && Array.isArray(assignedTo)) {
      const invalidMembers = assignedTo.filter(
        (userId) => !teamMemberIds.includes(userId.toString())
      );

      if (invalidMembers.length > 0) {
        return res.status(400).json({
          message: "One or more assigned users are not members of your team",
          invalidMembers,
        });
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        title,
        description,
        priority,
        dueDate,
        assignedTo,
        attachments,
        todoChecklist,
      },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Update Task Error:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

//Delete a Task (Admin Only)
const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) return res.status(404).json({ message: "Fask not found" });

  await task.deleteOne();
  res.json({ message: "Task deleted successfully" });
  try {
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// Update Task status (pending, in progress, completed)
const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Fask not found" });

    const isAssigned = task.assignedTo.some(
      (userId) => userId.toString() === req.user._id.toString()
    );

    if (!isAssigned && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    task.status = req.body.status || task.status;

    if (task.status === "Completed") {
      task.todoChecklist.forEach((item) => (item.completed = true));
      task.progress = 100;
    } else {
      task.progress = 0;
    }

    await task.save();
    res.json({ message: "Task status updated successfully", task });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

//Update Task Checklist
const updateTaskChecklist = async (req, res) => {
  try {
    const { todoChecklist } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (!task.assignedTo.includes(req.user._id) && req.user.role !== "admin") {
      res.status(403).json({ message: "Not authorized to update Checklist" });
    }

    task.todoChecklist = todoChecklist; //Replace with updated Checklist

    // Auto update progress based on checklist completion
    const completedCount = task.todoChecklist.filter(
      (item) => item.completed
    ).length;
    const totalItems = task.todoChecklist.length;

    task.progress =
      totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

    //   Auto mark task as completed if all items are checked
    if (task.progress === 100) {
      task.status = "Completed";
    } else if (task.progress > 0) {
      task.status = "In Progress";
    } else {
      task.status = "Pending";
    }

    await task.save();
    const updatedTask = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email profileImageUrl"
    );

    res.json({
      message: "Task checklist updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardData,
  getUserDashboardData,
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskChecklist,
};
