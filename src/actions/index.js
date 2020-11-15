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

// get users
export function getUsers() {
  return (dispatch, getState) => {
    dispatch(requestStart());
    axios
      .get(URL)
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
      .post(URL + (user._id !== "" ? "/" + user._id : ""), user)
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
      .delete(URL + "/" + user_id)
      .then(() => {
        dispatch(getUsers());
      })
      .catch((err) => {
        console.log(err);
        dispatch(requestFail(err));
      });
  };
}

// sort user
export function sortUsersAction(sortCol, order) {
  return {
    type: "SORT",
    sortCol,
    order,
  };
}

// search user
export function searchUserAction(keywords) {
  return {
    type: "SEARCH",
    keywords,
  };
}
