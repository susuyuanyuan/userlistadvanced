import { RUN_STATUS } from "./Constants";

const defaultState = {
  runStats: RUN_STATUS.FETCH_NEW,
  error: "",
  allUsers: [],
  idToFetchDependent: "",
  dependents: [],
  totalUserCount: 0,
  sortCol: "startDate",
  sortOrder: "desc",
  regex: "",
  id: "",
};

const usersReducer = (state = { ...defaultState }, action) => {
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
    case "FETCH_DEPENDENT":
      return {
        ...state,
        runStats: RUN_STATUS.LOADING,
        idToFetchDependent: action.id,
      };
    case "DEPENDENT_FETCH_SUCCESS":
      return {
        ...state,
        runStats: RUN_STATUS.READY_FOR_MORE,
        dependents: action.dependents,
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
    case "RESET":
      return { ...defaultState };
    default:
      return state;
  }
};

export default usersReducer;
