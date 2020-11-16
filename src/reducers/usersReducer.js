const usersReducer = (
  state = {
    isLoading: false,
    error: "NOT_INITIALIZED",
    allUsers: [],
    totalUserCount: 0,
    sortCol: "startDate",
    sortOrder: "desc",
  },
  action
) => {
  switch (action.type) {
    case "USER_FETCH_START":
      return {
        ...state,
        isLoading: true,
      };
    case "USER_FETCH_APPEND":
      return {
        ...state,
        isLoading: false,
        ...state.allUsers,
        allUsers: state.allUsers.concat(action.users),
      };
    case "USER_FETCH_OVERWRITE":
      console.log(action.users);
      return {
        ...state,
        isLoading: false,
        allUsers: action.users,
      };
    case "SET_TOTAL_USER_COUNT":
      return {
        ...state,
        totalUserCount: action.count,
      };
    case "SET_SORT_COL_ORDER":
      return {
        ...state,
        sortCol: action.sortCol,
        sortOrder: action.sortOrder,
      };
    case "USER_FETCH_FAIL":
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };

    default:
      return state;
  }
};

export default usersReducer;
