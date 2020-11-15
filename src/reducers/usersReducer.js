const usersReducer = (
  state = { isLoading: false, error: "", displayUsers: [], originalUsers: [] },
  action
) => {
  switch (action.type) {
    case "USER_FETCH_START":
      return {
        ...state,
        isLoading: true,
      };
    case "USER_FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        originalUsers: action.users,
        displayUsers: action.users,
      };
    case "SET_DISPLAY_USERS":
      // if users are empty, then we simply copy the original data back
      if (action.users === "") {
        return {
          ...state,
          ...state.originalUsers,
          displayUsers: state.originalUsers,
        };
      }
      return {
        ...state,
        displayUsers: action.users,
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
