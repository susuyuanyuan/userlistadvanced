import { RUN_STATUS } from "./Constants";

const usersReducer = (
  state = {
    runStats: RUN_STATUS.INITIAL,
    error: "",
    allUsers: [],
    totalUserCount: 0,
    sortCol: "startDate",
    sortOrder: "desc",
  },
  action
) => {
  switch (action.type) {
    case "SET_RUN_STATUS":
      return {
        ...state,
        runStats: action.runStats,
      };
    case "USER_FETCH_APPEND":
      return {
        ...state,
        ...state.allUsers,
        allUsers: state.allUsers.concat(action.users),
      };
    case "USER_FETCH_OVERWRITE":
      return {
        ...state,
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
        runStats: RUN_STATUS.FAILED,
        error: action.error,
      };

    default:
      return state;
  }
};

export default usersReducer;
