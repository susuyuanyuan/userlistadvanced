// Action creator
import axios from "axios";
const URL = "http://localhost:5000/api/armyUserList";

function requestStart() {
  return {
    type: "USER_FETCH_START",
  };
}

function requestSuccess(users) {
  return {
    type: "USER_FETCH_SUCCESS",
    users,
  };
}

function requestFail(error) {
  return {
    type: "USER_FETCH_FAIL",
    error,
  };
}

function setDisplayUsers(users) {
  return {
    type: "SET_DISPLAY_USERS",
    users,
  };
}

// get users
export function getUsers() {
  return (dispatch, getState) => {
    dispatch(requestStart());
    axios
      .get(URL + "/User")
      .then((response) => {
        dispatch(requestSuccess(response.data));
      })
      .catch((err) => {
        dispatch(requestFail(err));
      });
  };
}

//update user by id
export function updateUser(user, history) {
  return (dispatch, getState) => {
    console.log(user);
    axios
      .post(URL + "/User" + (user._id !== "" ? "/" + user._id : ""), user)
      .then(() => {
        history.push("/");
      })
      .catch((err) => {
        console.log(err);
        dispatch(requestFail(err));
      });
  };
}

//delete user by id
export function deleteUser(user_id) {
  return (dispatch, getState) => {
    axios
      .delete(URL + "/User/" + user_id)
      .then(() => {
        dispatch(getUsers());
      })
      .catch((err) => {
        console.log(err);
        dispatch(requestFail(err));
      });
  };
}

const compareValue = (order, a, b) => {
  if (a === b) {
    return 0;
  }
  return a < b ? order : -1 * order;
};

// sort user
export function sortUsersAction(sortCol, order) {
  return (dispatch, getState) => {
    dispatch(
      setDisplayUsers(
        [...getState().displayUsers].sort(function (a, b) {
          return compareValue(order, a[sortCol], b[sortCol]);
        })
      )
    );
  };
}

// search user
export function searchUserAction(regex) {
  return (dispatch, getState) => {
    // if regex are empty, then we simply copy the original data back
    if (regex === "") {
      return dispatch(setDisplayUsers(""));
    }
    axios
      .post(URL + "/Search", { regex })
      .then((res) => {
        dispatch(setDisplayUsers(res.data));
      })
      .catch((err) => {
        console.log(err);
        dispatch(requestFail(err));
      });
  };
}
