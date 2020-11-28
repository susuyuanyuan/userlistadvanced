import React from "react";
import { Link } from "react-router-dom";
import { LOGO_URL } from "../reducers/Constants";
import { deleteUser, setID, getDependents } from "../actions/index.js";

const UserEntry = (props) => {
  const user = props.user;

  const dispatch = props.dispatch;

  const formatDate = (date) => {
    return require("moment")(date).format("YYYY-MM-DD");
  };

  const onClickDSNum = () => {
    if (user.DSNum && user.DSNum > 0) {
      dispatch(getDependents(user._id));
    }
  };

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
      <td>{formatDate(user.startDate)}</td>
      <td>
        <a href={`skype:+1${user.phone}?call`}>{user.phone}</a>
      </td>
      <td>
        <a href={`mailto: ${user.email}`}>{user.email}</a>
      </td>
      <td>
        <Link
          to={"/"}
          onClick={(e) => {
            dispatch(setID(user.superiorID));
          }}
        >
          {user.superiorName}
        </Link>
      </td>
      <td id="DSNumCell" onClick={onClickDSNum}>
        {user.DSNum ? user.DSNum : ""}
      </td>
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
