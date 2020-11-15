import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { LOGO_URL } from "./Constants";

import {
  getUsers,
  deleteUser,
  sortUsersAction,
  searchUserAction,
} from "../actions/index.js";

import "./styles.css";

export function UserList() {
  const history = useHistory();
  const dispatch = useDispatch();
  // get allUsers
  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  // sort in back end
  const sortIcon = (col_name, col_id) => {
    const ASC = -1;
    const DSC = 1;
    const cname = "fas fa-chevron-";
    return (
      <th>
        {col_name}
        <button
          className="sort-button"
          onClick={() => dispatch(sortUsersAction(col_id, ASC))}
        >
          <i className={cname + "up"}></i>
        </button>
        <button
          className="sort-button"
          onClick={() => dispatch(sortUsersAction(col_id, DSC))}
        >
          <i className={cname + "down"}></i>
        </button>
      </th>
    );
  };

  const allUsers = useSelector((state) => state.displayUsers);
  const renderTable = () => {
    return (
      <div className="text-center">
        <table className="table table-striped">
          <thead className="thead-primary">
            <tr className="thead">
              <th>Avatar</th>
              {sortIcon("Name", "name")}
              {sortIcon("Sex", "sex")}
              {sortIcon("Rank", "rank")}
              {sortIcon("Start Date", "startDate")}
              {sortIcon("Phone", "phone")}
              {sortIcon("Email", "email")}
              {sortIcon("Superior", "superior_name")}
              {sortIcon("# of D. S.", "DSNum")}
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((user) => {
              let superior_name = null;
              if (user.superiorID !== "") {
                let superior = allUsers.find(
                  (this_user) => this_user._id === user.superiorID
                );
                if (superior) {
                  superior_name = superior.name;
                }
              }
              return (
                <tr key={user._id} className="text-capitalize">
                  <td>
                    <img
                      className="avatar"
                      src={
                        user.avatar && user.avatar !== ""
                          ? user.avatar
                          : LOGO_URL
                      }
                      alt="error"
                      width="30"
                      height="30"
                    />
                  </td>
                  <td>{user.name}</td>
                  <td>{user.sex}</td>
                  <td>{user.rank}</td>
                  <td>{user.startDate}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>{superior_name}</td>
                  <td>{user.DSNum}</td>
                  <td>
                    <button className="btn btn-light text-primary">
                      <Link to={`/EditUserPage/${user._id}`}>
                        <i className="fas fa-pencil-alt"></i> Edit
                      </Link>
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-light text-danger"
                      onClick={() => dispatch(deleteUser(user._id))}
                    >
                      <i className="fas fa-trash-alt"></i> Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
      <div className="ui divided list">{renderTable()}</div>
    </div>
  );
}
