const API_PATHS = {
  USERS: {
    GET_TEAM_MEMBERS: (userId) => `/api/users/team-members/${userId}`,
  },
};

module.exports = API_PATHS;
