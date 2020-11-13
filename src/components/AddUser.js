import React, { Component, Fragment, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addUser } from "../actions/index.js";

export function AddUser({ users, history }) {
  const dispatch = useDispatch();
  // input
  const [name, setName] = useState("");
  const [sex, setSex] = useState("M");
  const [rank, setRank] = useState("Soldier");
  const [startDate, setStartDate] = useState(null);
  const [phone, setPhone] = useState(null);
  const [email, setEmail] = useState("");
  const [superiorID, setSuperiorID] = useState(null);
  // validation
  const [error, setError] = useState();
  const isValid =
    email !== "" &&
    name !== "" &&
    phone !== "" &&
    rank !== "" &&
    startDate !== "" &&
    sex !== "" &&
    error === "";
  // for images
  const [file, setFile] = useState("");
  const [filename, setFilename] = useState("Choose File");
  const [filename, setFilename] = useState("Choose File");
  const logo =
    "https://images-na.ssl-images-amazon.com/images/I/819KR%2BawXhL._AC_SL1500_.jpg";

  // today
  //const moment = require("moment");
  const today = require("moment")(new Date()).format("YYYY-MM-DD");

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
    if (e.target.value.match(/[^A-Za-z ]/g) === null) {
      setError("Name " + error);
    }
    console.log();
  };

  const handlePhone = (e) => {
    setPhone(e.target.value);
    if (e.target.value.match(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/) === null) {
      setError("Phone " + error);
    }
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
    if (e.target.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g) === null) {
      setError("Email " + error);
    }
  };

  const handleAvatar = (e) => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
    setImage(URL.createObjectURL(e.target.files[0]));
    console.log(file);
  };

  const fileUpLoad = () => {
    return (
      <Fragment>
        <img src={image} width="200" height="200" />
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

  const userInput = "col-sm mt-2 mb-2";
  const renderInput = () => {
    return (
      <div className="container">
        <div className="row">
          <div className={userInput}>Name: </div>
          <div className={userInput}>
            <input
              type="text"
              placeholder="Letters only"
              onChange={(e) => handleName(e)}
            />
          </div>
        </div>
        <div className="row">
          <div className={userInput}>Rank:</div>
          <div className={userInput}>
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
          <div className={userInput}>Sex:</div>
          <div className={userInput}>
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
          <div className={userInput}>Start date:</div>
          <div className={userInput}>
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
          <div className={userInput}>Office Phone:</div>
          <div className={userInput}>
            <input
              type="text"
              placeholder="xxx-xxx-xxxx"
              onChange={(e) => handlePhone(e)}
            />
          </div>
        </div>
        <div className="row">
          <div className={userInput}>Email:</div>
          <div className={userInput}>
            <input type="text" onChange={(e) => handleEmail(e)} />
          </div>
        </div>
        <div className="row">
          <div className={userInput}>Superior:</div>
          <div className={userInput}>
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

  return (
    <div className="user-container">
      <div className="headers">
        <img src={logo} alt="error" width="200" height="200" />
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
      <div>{error === "" ? null : error + "not valid"}</div>
    </div>
  );
}
