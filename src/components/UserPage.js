import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../actions/index.js";
import Resizer from "react-image-file-resizer";
import { LOGO_URL } from "./Constants";

export function UserPage({ match, history }) {
  const dispatch = useDispatch();
  let id = "";
  if (match.params) {
    if (match.params.id) {
      id = match.params.id;
    }
  }

  const allUsers = useSelector((state) => {
    return state.allUsers;
  });

  let user = null;
  if (id !== "") {
    user = allUsers.find((user) => user._id === id);
    if (!user) {
      console.log("Can't find this user: " + id);
      history.goBack();
    }
  }

  // today
  const today = require("moment")(new Date()).format("YYYY-MM-DD");
  // input
  const [name, setName] = useState(user ? user.name : "");
  const [sex, setSex] = useState(user ? user.sex : "M");
  const [rank, setRank] = useState(user ? user.rank : "Soldier");
  const [startDate, setStartDate] = useState(user ? user.startDate : today);
  const [phone, setPhone] = useState(user ? user.phone : "");
  const [email, setEmail] = useState(user ? user.email : "");
  const [superiorID, setSuperiorID] = useState(user ? user.superiorID : "");
  const [superiorName, setSuperiorName] = useState(
    user ? user.superiorName : ""
  );
  const [imageFile, setImageFile] = useState(
    user && user.avatar ? user.avatar : ""
  );

  // validation
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
      avatar: imageFile,
      name: name,
      sex: sex,
      rank: rank,
      startDate: startDate,
      phone: phone,
      email: email,
      superiorID: superiorID,
      superiorName: superiorName,
      _id: user ? user._id : "",
    };

    dispatch(updateUser(added_user, history));
  };

  const handleName = (e) => {
    if (e.target.value.match(/[^A-Za-z ]/g) === null) {
      setName(e.target.value);
    }
  };

  const handlePhone = (e) => {
    if (e.target.value.match(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/)) {
      setPhone(e.target.value);
    }
  };

  const handleEmail = (e) => {
    if (e.target.value.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
      setEmail(e.target.value);
    }
  };

  const handleAvatar = (e) => {
    // we use image resizer to read the image and resize&compress image here
    Resizer.imageFileResizer(
      e.target.files[0],
      200 /* maxWidth */,
      200 /* maxHeight */,
      "JPEG" /* compressFormat */,
      50 /* quality */,
      0 /* rotation */,
      (uri) => {
        if (uri) {
          setImageFile(uri);
        } else {
          console.log("Failed to read: " + e.target.files[0]);
        }
      }
    );
  };

  const fileUpLoad = () => {
    return (
      <div>
        <img
          src={imageFile ? imageFile : LOGO_URL}
          alt="error"
          width="200"
          height="200"
        />
        <div className="custom-file mb-4">
          <button>
            Choose File
            <input
              type="file"
              className="custom-file-input"
              id="customFile"
              onChange={handleAvatar}
            />
          </button>
          <p>{imageFile === "" ? "No file chosen" : imageFile.name}</p>
        </div>
      </div>
    );
  };

  const returnSelectableSuperior = () => {
    return allUsers.map((this_user) => {
      if (user && user._id === this_user._id) {
        return "";
      }
      return (
        <option value={this_user._id} key={this_user._id}>
          {this_user.name}
        </option>
      );
    });
  };

  const handleSuperior = (superiorID) => {
    if (superiorID !== "") {
      const superior = allUsers.find((user) => user._id === superiorID);
      if (superior) {
        setSuperiorID(superior._id);
        setSuperiorName(superior.name);
      }
    } else {
      setSuperiorID("");
      setSuperiorName("");
    }
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
              value={name}
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
              value={rank}
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
          <div className={userInput}>Start date:</div>
          <div className={userInput}>
            <input
              type="date"
              id="startDate"
              value={startDate}
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
              value={phone}
              placeholder="xxx-xxx-xxxx"
              onChange={(e) => handlePhone(e)}
            />
          </div>
        </div>
        <div className="row">
          <div className={userInput}>Email:</div>
          <div className={userInput}>
            <input type="text" value={email} onChange={(e) => handleEmail(e)} />
          </div>
        </div>
        <div className="row">
          <div className={userInput}>Superior:</div>
          <div className={userInput}>
            <select
              name="superior"
              id="superior"
              value={superiorID}
              onChange={(e) => handleSuperior(e.target.value)}
            >
              <option value=""></option>
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
        <img src={LOGO_URL} alt="error" width="200" height="200" />
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
      <div>{name === "" ? "Name is not valid" : null}</div>
      <div>{phone === "" ? "Phone is not valid" : null}</div>
      <div>{email === "" ? "Email is not valid" : null}</div>
    </div>
  );
}
