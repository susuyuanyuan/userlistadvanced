import { RUN_STATUS } from "./Constants";

const usersReducer = (
  state = {
    runStats: RUN_STATUS.FETCH_NEW,
    error: "",
    allUsers: [],
    totalUserCount: 0,
    sortCol: "startDate",
    sortOrder: "desc",
    regex: "",
    id: "",
  },
  action
) => {
  switch (action.type) {
    case "SET_RUN_STATUS":
      return {
        ...state,
        runStats: action.runStats,
      };
    case "USER_FETCH_SUCCESS":
      return {
        ...state,
        ...state.allUsers,
        runStats: RUN_STATUS.READY_FOR_MORE,
        allUsers: action.users,
        totalUserCount: action.totalUserCount,
      };
    case "SET_SORT_COL_ORDER":
      return {
        ...state,
        runStats: RUN_STATUS.FETCH_NEW,
        sortCol: action.sortCol,
        sortOrder: action.sortOrder,
      };
    case "USER_FETCH_FAIL":
      return {
        ...state,
        runStats: RUN_STATUS.FAILED,
        error: action.error,
      };
    case "SET_REGEX":
      return {
        ...state,
        runStats: RUN_STATUS.FETCH_NEW,
        regex: action.regex,
      };
    case "SET_ID":
      return {
        ...state,
        runStats: RUN_STATUS.FETCH_NEW,
        id: action.id,
      };
    default:
      return state;
  }
};

export default usersReducer;
