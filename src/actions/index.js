// Action creator
import axios from "axios";
import { RUN_STATUS } from "../components/Constants";
const URL = "http://localhost:5000/api/armyUserList";

function setRunStatus(runStats) {
  return {
    type: "SET_RUN_STATUS",
    runStats,
  };
}

function requestFetchSuccess(overwrite, users, totalUserCount) {
  return {
    type: "USER_FETCH_SUCCESS",
    overwrite,
    users,
    totalUserCount,
  };
}

function requestFail(error) {
  return {
    type: "USER_FETCH_FAIL",
    error,
  };
}

function setRegexAction(regex) {
  return {
    type: "SET_REGEX",
    regex,
  };
}

function setSortColOrderAction(sortCol, sortOrder) {
  return {
    type: "SET_SORT_COL_ORDER",
    sortCol,
    sortOrder,
  };
}

const USER_API = "/User";

export function setSortColOrder(sortCol, sortOrder) {
  return (dispatch, getState) => {
    dispatch(setSortColOrderAction(sortCol, sortOrder));
  };
}

export function setRegex(regex) {
  return (dispatch, getState) => {
    dispatch(setRegexAction(regex));
  };
}

// get users
export function getUsers(offset, limit, sortCol, order, regex, overwrite) {
  return (dispatch, getState) => {
    dispatch(setRunStatus(RUN_STATUS.LOADING));
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
          order +
          "&regex=" +
          regex
      )
      .then((response) => {
        dispatch(
          requestFetchSuccess(
            overwrite,
            response.data.docs,
            response.data.totalDocs
          )
        );
      })
      .catch((err) => {
        console.error(err);
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
        console.error(err);
        dispatch(requestFail(err));
      });
  };
}

//delete user by id
export function deleteUser(user_id, history) {
  if (user_id === "") {
    console.error("Passing empty user");
    return;
  }
  return (dispatch, getState) => {
    axios
      .delete(URL + USER_API + "/" + user_id)
      .then(() => {
        history.go(0);
      })
      .catch((err) => {
        console.error(err);
        dispatch(requestFail(err));
      });
  };
}
