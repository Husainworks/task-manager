export const BASE_URL = "http://192.168.1.194:8000";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    GET_PROFILE: "/api/auth/profile", //Get logged-in user Details
  },
  USERS: {
    GET_ALL_USERS: "/api/users",
    GET_USER_BY_ID: (userId) => `/api/users/${userId}`,
    GET_TEAM_MEMBERS: (userId) => `/api/users/team-members/${userId}`,
    CREATE_USER: "/api/users",
    UPDATE_USER: (userId) => `/api/users/${userId}`,
    DELETE_USER: (userId) => `/api/users/${userId}`,
  },
  TASKS: {
    GET_DASHBOARD_DATA: "/api/tasks/dashboard-data",
    GET_USER_DASHBOARD_DATA: "/api/tasks/user-dashboard-data",
    GET_ALL_TASKS: "/api/tasks",
    GET_TASK_BY_ID: (userId) => `/api/tasks/${userId}`,
    CREATE_TASK: "/api/tasks",
    UPDATE_TASK: (userId) => `/api/tasks/${userId}`,
    DELETE_TASK: (userId) => `/api/tasks/${userId}`,

    UPDATE_TASK_STATUS: (userId) => `/api/tasks/${userId}/status`,
    UPDATE_TODO_CHECKLIST: (userId) => `/api/tasks/${userId}/todo`,
  },
  REPORTS: {
    EXPORT_TASKS: "/api/reports/export/tasks",
    EXPORT_USERS: "/api/reports/export/users",
  },
  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image",
  },
  COMPANY: {
    REGISTER: "/api/auth/company/register",
  },
};
