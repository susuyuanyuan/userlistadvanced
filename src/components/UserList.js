import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { LOGO_URL } from "./Constants";
import InfiniteScroll from "react-infinite-scroll-component";
import UserEntry from "./UserEntry";

import {
  getUsers,
  searchUserAction,
  setSortColOrder,
} from "../actions/index.js";

import "./styles.css";

export function UserList() {
  const history = useHistory();
  const dispatch = useDispatch();
  const allUsers = useSelector((state) => state.allUsers);
  const error = useSelector((state) => state.error);
  const sortCol = useSelector((state) => state.sortCol);
  const sortOrder = useSelector((state) => state.sortOrder);

  useEffect(() => {
    if (error === "NOT_INITIALIZED") {
      dispatch(getUsers(0, 10, sortCol, sortOrder, true));
    }
  }, [dispatch, error, sortCol, sortOrder]);

  // sort in back end
  const sortIcon = (colName, colId) => {
    const cname = "fas fa-chevron-";
    return (
      <th>
        {colName}
        <button
          className="sort-button"
          onClick={() => {
            dispatch(setSortColOrder(colId, "desc"));
          }}
        >
          <i className={cname + "up"}></i>
        </button>
        <button
          className="sort-button"
          onClick={() => {
            dispatch(setSortColOrder(colId, "asc"));
          }}
        >
          <i className={cname + "down"}></i>
        </button>
      </th>
    );
  };

  const [hasMoreUser, setHasMoreUser] = useState(true);
  const isLoading = useSelector((state) => state.isLoading);
  const totalUserCount = useSelector((state) => state.totalUserCount);

  const rowLimit = 10;

  const getMoreUsers = () => {
    if (isLoading) {
      return;
    }
    if (allUsers.length >= totalUserCount) {
      console.log("current user length: ", allUsers.length);
      setHasMoreUser(false);
      return;
    }

    dispatch(getUsers(allUsers.length, rowLimit, sortCol, sortOrder, false));
    setHasMoreUser(true);
  };

  const renderTableHead = () => {
    return (
      <div className="text-center">
        <table id="tableHeader" className="table table-striped">
          <thead className="thead-primary">
            <tr className="thead">
              <th>Avatar</th>
              {sortIcon("Name", "name")}
              {sortIcon("Sex", "sex")}
              {sortIcon("Rank", "rank")}
              {sortIcon("Start Date", "startDate")}
              {sortIcon("Phone", "phone")}
              {sortIcon("Email", "email")}
              {sortIcon("Superior", "superiorName")}
              {sortIcon("# of D. S.", "DSNum")}
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    );
  };

  const renderTableContent = () => {
    return (
      <div
        className="text-center"
        id="scrollDev"
        style={{ height: 400, overflow: "auto" }}
      >
        <InfiniteScroll
          dataLength={allUsers.length}
          next={getMoreUsers}
          hasMore={hasMoreUser}
          loader={<h4>Loading...</h4>}
          scrollableTarget="scrollDev"
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>That's all</b>
            </p>
          }
        >
          <table id="tableContent" className="table table-striped">
            <thead></thead>
            <tbody>
              {allUsers.map((user) => (
                <UserEntry
                  user={user}
                  dispatch={dispatch}
                  history={history}
                  key={user._id}
                />
              ))}
            </tbody>
          </table>
        </InfiniteScroll>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="headers">
        <img src={LOGO_URL} alt="error" width="200" height="200" />
        <h1>US Army Personnel Registry</h1>
      </div>
      <div className="bar">
        <div className="search-group">
          <input
            type="text"
            placeholder="search"
            onChange={(e) => dispatch(searchUserAction(e.target.value))}
          />
          <span className="input-group-btn">
            <button className="btn btn-default" type="submit">
              <i className="fas fa-times"></i>
            </button>
          </span>
        </div>
        <div className="button-group">
          <button className="submit-button">Reset</button>
          <button
            type="submit"
            className="submit-button"
            onClick={() => {
              history.push("/UserPage");
            }}
          >
            New Soldier
          </button>
        </div>
      </div>
      <div className="ui divided list">{renderTableHead()}</div>
      <div className="ui divided list">{renderTableContent()}</div>
    </div>
  );
}
