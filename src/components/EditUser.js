import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../actions/index.js";

export const EditUser = ({ match, history }) => {
  const { id } = match.params;

  const allUsers = useSelector((state) => state.displayData);
  const user = allUsers.find((user) => user._id === id);
  if (!user) {
    history.goBack();
  }

  const [name, setName] = useState(user.name);
  const [sex, setSex] = useState(user.sex);
  const [rank, setRank] = useState(user.rank);
  const [startDate, setStartDate] = useState(user.startDate);
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email);
  const [superiorID, setSuperiorID] = useState(user.superiorID);

  console.log(startDate);

  let startDateStr;
  if (startDate !== "") {
    const date = new Date(startDate);
    startDateStr =
      date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
  }

  const dispatch = useDispatch();

  const isValid =
    email !== "" &&
    rank !== "" &&
    startDate !== "" &&
    name !== "" &&
    sex !== "";

  const submitUser = () => {
    if (!isValid) {
      return;
    }
    const added_user = {
      _id: id,
      name: name,
      sex: sex,
      rank: rank,
      startDate: startDate,
      phone: phone,
      email: email,
      superiorID: superiorID,
    };
    dispatch(updateUser(id, added_user, history));
  };

  const handleName = (e) => {
    setName(e.target.value);
    console.log();
  };

  const handlePhone = (e) => {
    setPhone(e.target.value);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const fileUpLoad = () => {
    return (
      <Fragment>
        <form>
          <div className="custom-file mb-4">
            <input type="file" className="custom-file-input" id="avatar" />
            <label className="custom-file-label" for="customFile">
              Choose File
            </label>
          </div>
          <input
            type="btn btn-primary btn-block mt-4"
            value="Upload"
            className=""
          />
        </form>
      </Fragment>
    );
  };

  const returnSelectableSuperior = () => {
    return allUsers.map((user) => {
      return <option value={user._id}>{user.name}</option>;
    });
  };

  const renderInput = () => {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm mt-2 mb-2">Name: </div>
          <div className="col-sm mt-2 mb-2">
            <input
              type="text"
              value={name}
              placeholder="Letters only"
              onChange={(e) => handleName(e)}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm mt-2 mb-2">Rank:</div>
          <div className="col-sm mt-2 mb-2">
            <select
              name="rank"
              value={rank}
              id="rank"
              onChange={(e) => setRank(e.target.value)}
            >
              <option value="Soldier">Soldier</option>
              <option value="Captain">Captain</option>
              <option value="Colonel">Colonel</option>
              <option value="General">General</option>
            </select>
          </div>
        </div>
        <div className="row">
          <div className="col-sm mt-2 mb-2">Sex:</div>
          <div className="col-sm mt-2 mb-2">
            <select
              name="sex"
              id="sex"
              value={sex}
              onChange={(e) => setSex(e.target.value)}
            >
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="NA">Other</option>
            </select>
          </div>
        </div>
        <div className="row">
          <div className="col-sm mt-2 mb-2">Start date:</div>
          <div className="col-sm mt-2 mb-2">
            <input
              type="date"
              id="startDate"
              value={startDateStr}
              min="2010-01-01"
              max="2020-11-12"
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm mt-2 mb-2">Office Phone:</div>
          <div className="col-sm mt-2 mb-2">
            <input
              value={phone}
              type="text"
              placeholder="xxx-xxx-xxxx"
              onChange={(e) => handlePhone(e)}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm mt-2 mb-2">Email:</div>
          <div className="col-sm mt-2 mb-2">
            <input type="text" value={email} onChange={(e) => handleEmail(e)} />
          </div>
        </div>
        <div className="row">
          <div className="col-sm mt-2 mb-2">Superior:</div>
          <div className="col-sm mt-2 mb-2">
            <select
              name="superior"
              id="superior"
              value={superiorID}
              onChange={(e) => setSuperiorID(e.target.value)}
            >
              {returnSelectableSuperior(user._id)}
            </select>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="user container">
      <div className="headers">
        <h1>New Soldier</h1>
      </div>
      <div className="user-button-group">
        <button className="submit-button" onClick={() => history.push("/")}>
          Cancel
        </button>
        <button
          className={isValid ? "submit-button" : "submit-disable-button"}
          disabled={!isValid}
          onClick={submitUser}
        >
          Save
        </button>
      </div>
      {renderInput()}
    </div>
  );
};
