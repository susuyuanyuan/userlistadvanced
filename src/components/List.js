import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
  getUsers,
  deleteUser,
  sortUsersAction,
  searchUserAction,
} from "../actions/index.js";
import "./styles.css";

export function UserList() {
  const dispatch = useDispatch();
  // get users
  useEffect(() => {
    dispatch(getUsers());
  }, []);

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

  const users = useSelector((state) => state.displayData);
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
              {sortIcon("Start Date", "stdat")}
              {sortIcon("Phone", "phone")}
              {sortIcon("Email", "email")}
              {sortIcon("Superior", "superior")}
              {sortIcon("# of D. S.", "ds")}
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              let superior_name = null;
              if (user.superiorID !== "") {
                let superior = users.find(
                  (this_user) => this_user._id === user.superiorID
                );
                if (superior) {
                  superior_name = superior.name;
                }
              }
              return (
                <tr key={user._id} className="text-capitalize">
                  <td>need to add upload photo feature</td>
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
                      <Link to={`/editUser/${user._id}`}>
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
          <form method="get" action="/addUser">
            <button type="submit" className="submit-button">
              New Soldier
            </button>
          </form>
        </div>
      </div>
      <div className="ui divided list">{renderTable()}</div>
    </div>
  );
}
