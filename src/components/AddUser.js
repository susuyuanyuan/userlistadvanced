import React, { Component, Fragment, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { addUser } from "../actions/index.js";

export function AddUser({ users }) {
  const [name, setName] = useState("");
  const [sex, setSex] = useState("M");
  const [rank, setRank] = useState("Soldier");
  const [startDate, setStartDate] = useState(null);
  const [phone, setPhone] = useState(null);
  const [email, setEmail] = useState("");
  const [superiorID, setSuperiorID] = useState(null);
  const [isNotEmpty, setIsNotEmpty] = useState(true);
  const [isValidName, setIsValidName] = useState(false);
  const [isValidPhone, setIsValidPhone] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();

  const submitUser = () => {
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

  const handleEmpty = () => {
    const arr = [name, startDate, phone, email];
    const empty =
      arr.findIndex(function (ele) {
        return ele === null;
      }) < 0
        ? true
        : false;
    setIsNotEmpty(empty);
    if (isNotEmpty) {
      submitUser();
    }
  };

  const handleName = (e) => {
    setName(e.target.value);
    setIsValidName(e.target.value.match(/[^A-Za-z ]/g) === null);
    console.log();
  };

  const handlePhone = (e) => {
    setPhone(e.target.value);
    setIsValidPhone(e.target.value.match(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/));
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setIsValidEmail(e.target.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g));
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
              value="2020-10-22"
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
              <option value="NA">NA</option>
              <option value="NA">NA</option>
            </select>
          </div>
        </div>
      </div>
    );
  };

  const validEntry = isNotEmpty && isValidName && isValidPhone && isValidEmail;

  return (
    <div className="user container">
      <div className="headers">
        <h1>New Soldier</h1>
      </div>
      <div className="user-button-group">
        <button className="submit-button" onClick={() => history.push("/")}>
          Cancel
        </button>
        <form onSubmit={() => handleEmpty()}>
          <button
            className={validEntry ? "submit-button" : "submit-disable-button"}
          >
            Save
          </button>
        </form>
      </div>
      {renderInput()}
    </div>
  );
}
