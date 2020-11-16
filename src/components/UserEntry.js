import React from "react";
import { Link } from "react-router-dom";
import { LOGO_URL } from "./Constants";
import { deleteUser } from "../actions/index.js";

const UserEntry = (props) => {
  const user = props.user;
  const dispatch = props.dispatch;
  return (
    <tr key={user._id} className="text-capitalize">
      <td>
        <img
          className="avatar"
          src={user.avatar && user.avatar !== "" ? user.avatar : LOGO_URL}
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
      <td>{user.superiorName}</td>
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
};

export default UserEntry;
