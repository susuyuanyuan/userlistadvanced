// Action creator
import axios from "axios";
const URL = "http://localhost:5000/api/armyUserList";

function requestStart() {
  return {
    type: "USER_FETCH_START",
  };
}

function requestFetchOverwrite(users) {
  return {
    type: "USER_FETCH_OVERWRITE",
    users,
  };
}

function requestFetchAppend(users) {
  return {
    type: "USER_FETCH_APPEND",
    users,
  };
}

function requestFail(error) {
  return {
    type: "USER_FETCH_FAIL",
    error,
  };
}

function setTotalUserCount(count) {
  return {
    type: "SET_TOTAL_USER_COUNT",
    count,
  };
}

const USER_API = "/User";

export function setSortColOrder(sortCol, sortOrder) {
  return {
    type: "SET_SORT_COL_ORDER",
    sortCol,
    sortOrder,
  };
}

// get users
export function getUsers(offset, limit, sortCol, order, overwrite) {
  return (dispatch, getState) => {
    dispatch(requestStart());
    console.log("getUser");
    axios
      .get(
        URL +
          USER_API +
          "?offset=" +
          offset +
          "&limit=" +
          limit +
          "&sortCol=" +
          sortCol +
          "&order=" +
          order
      )
      .then((response) => {
        const allUsers = response.data.docs;
        if (overwrite) {
          dispatch(requestFetchOverwrite(allUsers));
        } else {
          dispatch(requestFetchAppend(allUsers));
        }
        dispatch(setTotalUserCount(response.data.totalDocs));
      })
      .catch((err) => {
        console.log(err);
        dispatch(requestFail(err));
      });
  };
}

//update user by id
export function updateUser(user, history) {
  return (dispatch, getState) => {
    axios
      .post(URL + USER_API, user)
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
export function deleteUser(user_id, history) {
  if (user_id === "") {
    console.log("Passing empty user");
    return;
  }
  return (dispatch, getState) => {
    axios
      .delete(URL + USER_API + "/" + user_id)
      .then(() => {
        history.go(0);
      })
      .catch((err) => {
        console.log(err);
        dispatch(requestFail(err));
      });
  };
}

// search user
export function searchUserAction(regex) {
  return (dispatch, getState) => {
    // if regex are empty, then we simply copy the original data back
    if (regex === "") {
      console.log("Passing empty regex");
      return;
    }
    console.log("Search with: " + regex);
    axios
      .post(URL + "/Search", { regex })
      .then((res) => {
        dispatch(requestFetchOverwrite(res.data));
      })
      .catch((err) => {
        console.log(err);
        dispatch(requestFail(err));
      });
  };
}
