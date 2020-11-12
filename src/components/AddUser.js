import React, { Component, Fragment, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addUser } from "../actions/index.js";

export function AddUser({ users, history }) {
  // input
  const [name, setName] = useState("");
  const [sex, setSex] = useState("M");
  const [rank, setRank] = useState("Soldier");
  const [startDate, setStartDate] = useState(null);
  const [phone, setPhone] = useState(null);
  const [email, setEmail] = useState("");
  const [superiorID, setSuperiorID] = useState(null);
  // validation
  //   const [isNotEmpty, setIsNotEmpty] = useState(true);
  //   const [isValidName, setIsValidName] = useState(false);
  //   const [isValidPhone, setIsValidPhone] = useState(false);
  //   const [isValidEmail, setIsValidEmail] = useState(false);
  // for images
  const [file, setFile] = useState("");
  const [filename, setFilename] = useState("Choose File");

  const dispatch = useDispatch();

  const allUsers = useSelector((state) => state.displayData);
  const moment = require("moment");
  const today = moment(new Date()).format("YYYY-MM-DD");

  const isValid =
    email !== "" &&
    name !== "" &&
    phone !== "" &&
    rank !== "" &&
    startDate !== "" &&
    sex !== "";

  const submitUser = () => {
    if (!isValid) {
      return;
    }
    const added_user = {
      name: name,
      sex: sex,
      rank: rank,
      startDate: startDate,
      phone: phone,
      email: email,
      superiorID: superiorID,
    };
    dispatch(addUser(added_user, history));
  };

  const handleName = (e) => {
    setName(e.target.value);
    //setIsValidName(e.target.value.match(/[^A-Za-z ]/g) === null);
    console.log();
  };

  const handlePhone = (e) => {
    setPhone(e.target.value);
    //setIsValidPhone(e.target.value.match(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/));
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
    //setIsValidEmail(e.target.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g));
  };

  const handleAvatar = (e) => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const fileUpLoad = () => {
    return (
      <Fragment>
        <form>
          <div className="custom-file mb-4">
            <input
              type="file"
              className="custom-file-input"
              id="customFile"
              onChange={handleAvatar}
            />
            <label className="custom-file-label" htmlFor="customFile">
              {filename}
            </label>
          </div>

          <input type="submit" value="Upload" className="submit-button" />
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
              value={today}
              min="2010-01-01"
              max={today}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm mt-2 mb-2">Office Phone:</div>
          <div className="col-sm mt-2 mb-2">
            <input
              type="text"
              placeholder="xxx-xxx-xxxx"
              onChange={(e) => handlePhone(e)}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm mt-2 mb-2">Email:</div>
          <div className="col-sm mt-2 mb-2">
            <input type="text" onChange={(e) => handleEmail(e)} />
          </div>
        </div>
        <div className="row">
          <div className="col-sm mt-2 mb-2">Superior:</div>
          <div className="col-sm mt-2 mb-2">
            <select
              name="superior"
              id="superior"
              onChange={(e) => setSuperiorID(e.target.value)}
            >
              {returnSelectableSuperior()}
            </select>
          </div>
        </div>
      </div>
    );
  };

  // const validEntry = isNotEmpty && isValidName && isValidPhone && isValidEmail;

  return (
    <div className="user-container">
      <div className="headers">
        <h1>New Soldier</h1>
      </div>
      <div className="user-button-group">
        <button className="submit-button" onClick={() => history.push("/")}>
          Cancel
        </button>
        <button
          className={isValid ? "submit-button" : "submit-disable-button"}
          onClick={submitUser}
        >
          Save
        </button>
      </div>
      <main className="user-main">
        <div>{fileUpLoad()}</div>
        <div>{renderInput()}</div>
      </main>
    </div>
  );
}
