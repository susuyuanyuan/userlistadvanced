// Action creator
import axios from "axios";
import { RUN_STATUS } from "../reducers/Constants";
const URL = "http://localhost:5000/api/armyUserList";

function setRunStatus(runStats) {
  return {
    type: "SET_RUN_STATUS",
    runStats,
  };
}

function requestFetchSuccess(users, totalUserCount) {
  return {
    type: "USER_FETCH_SUCCESS",
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

function setResetAction() {
  return {
    type: "RESET",
  };
}

export function setReset() {
  return (dispatch, getState) => {
    dispatch(setResetAction());
  };
}

function setRegexAction(regex) {
  return {
    type: "SET_REGEX",
    regex,
  };
}

export function setRegex(regex) {
  return (dispatch, getState) => {
    dispatch(setRegexAction(regex));
  };
}

function setIDAction(id) {
  return {
    type: "SET_ID",
    id,
  };
}

export function setID(id) {
  return (dispatch, getState) => {
    dispatch(setIDAction(id));
  };
}

function setSortColOrderAction(sortCol, sortOrder) {
  return {
    type: "SET_SORT_COL_ORDER",
    sortCol,
    sortOrder,
  };
}

export function setSortColOrder(sortCol, sortOrder) {
  return (dispatch, getState) => {
    dispatch(setSortColOrderAction(sortCol, sortOrder));
  };
}

function setDirectReportAction(manager_id, soldier_id) {
  return {
    type: "SET_DIRECT_REPORT",
    manager_id,
    soldier_id,
  };
}

export function setDirectReport(manager_id, soldier_id) {
  return (dispatch, getState) => {
    dispatch(setDirectReportAction(manager_id, soldier_id));
  };
}

const USER_API = "/User";

// use map to filter duplicates
function deDupUsers(users) {
  var seen = new Set();
  return users.filter(function (user) {
    return seen.has(user._id) ? false : seen.add(user._id);
  });
}

// get users
export function getUsers(offset, limit, sortCol, order, regex, id, overwrite) {
  return (dispatch, getState) => {
    if (getState().runStats === RUN_STATUS.LOADING) {
      return;
    }
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
          regex +
          "&id=" +
          id
      )
      .then((response) => {
        const newUsers = overwrite
          ? response.data.docs
          : deDupUsers(getState().allUsers.concat(response.data.docs));
        dispatch(requestFetchSuccess(newUsers, response.data.totalDocs));
      })
      .catch((err) => {
        console.error(err);
        dispatch(requestFail(err));
      });
  };
}

export function getDependents(supervisorId) {
  return (dispatch, getState) => {
    if (getState().runStats === RUN_STATUS.LOADING) {
      return;
    }
    dispatch(setRunStatus(RUN_STATUS.LOADING));
    console.log(supervisorId);
    axios
      .get(URL + USER_API + "?superiorID=" + supervisorId)
      .then((response) => {
        // means there is no one
        if (response.data.docs.length === 0) {
          dispatch(setRunStatus(RUN_STATUS.READY_FOR_MORE));
          return;
        }
        dispatch(
          requestFetchSuccess(response.data.docs, response.data.totalDocs)
        );
      })
      .catch((err) => {
        console.error(err);
        dispatch(requestFail(err));
      });
  };
}

// update or add user
export function updateUser(user, history) {
  console.log(user);
  return (dispatch, getState) => {
    axios
      .post(URL + USER_API, user)
      .then(() => {
        dispatch(setRunStatus(RUN_STATUS.FETCH_NEW));
        history.push("/");
      })
      .catch((err) => {
        console.error(err);
        dispatch(requestFail(err));
      });
  };
}

// delete user by id
export function deleteUser(user_id) {
  if (user_id === "") {
    console.error("Passing empty user");
    return;
  }
  return (dispatch, getState) => {
    axios
      .delete(URL + USER_API + "/" + user_id)
      .then(() => {
        dispatch(setRunStatus(RUN_STATUS.FETCH_NEW));
      })
      .catch((err) => {
        console.error(err);
        dispatch(requestFail(err));
      });
  };
}
