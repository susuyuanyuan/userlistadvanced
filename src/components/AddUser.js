import React, { Component, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { addUser } from "../actions/index.js";

function AddUser({ users }) {
  const [name, setName] = useState("");
  const [sex, setSex] = useState("M");
  const [rank, setRank] = useState("Soldier");
  const [startDate, setStartDate] = useState(null);
  const [phone, setPhone] = useState(null);
  const [email, setEmail] = useState("");
  const [superiorID, setSuperiorID] = useState(null);
  const [isNotEmpty, setIsNotEmpty] = useState(false);
  const [isValidName, setIsValidName] = useState(true);
  const [isValidPhone, setIsValidPhone] = useState(true);
  const [isValidEmail, setIsValidEmail] = useState(true);

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
  };

  const handleName = (e) => {
    setName(e.target.value);
    setIsValidName(e.target.value.match(/[^A-Za-z ]/g) === null);
  };

  const handlePhone = (e) => {
    setPhone(e.target.value);
    setIsValidPhone(e.target.value.match(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/));
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
    setIsValidEmail(e.target.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g));
  };

  const validEntry = isNotEmpty && isValidName && isValidPhone && isValidEmail;

  return (
    <div className="container ml-0 table-striped">
      <div className="row">
        <div>Name: </div>
        <div>
          <input
            type="text"
            placeholder="Letters only"
            onChange={(e) => handleName(e)}
          />
        </div>
      </div>
      <div className="row">
        <div>Rank:</div>
        <div>
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
        <div>Sex:</div>
        <div>
          <select name="sex" id="sex" onChange={(e) => setSex(e.target.value)}>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="NA">Other</option>
          </select>
        </div>
      </div>
      <div className="row">
        <div>Start date:</div>
        <div>
          <input
            type="date"
            id="startDate"
            value="2020-10-22"
            min="2010-01-01"
            max="2020-11-12"
          />
        </div>
      </div>
      <div className="row">
        <div>Office Phone:</div>
        <div>
          <input
            type="text"
            placeholder="xxx-xxx-xxxx"
            onChange={(e) => handlePhone(e)}
          />
        </div>
      </div>
      <div className="row">
        <div>Email:</div>
        <div>
          <input type="text" onChange={(e) => handleEmail(e)} />
        </div>
      </div>
      <div className="row">
        <div>Superior:</div>
        <div>
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
}
class AddUser extends Component {
  //   constructor(props) {
  //     super(props);
  //     this.state = {
  //       name: "",
  //       sex: "M",
  //       rank: "Soldier",
  //       startDate: "",
  //       phone: null,
  //       email: "",
  //       superior: null,
  //     };
  //   }

  render() {
    return (
      <div className="grid-container">
        <div>
          <h1 className="headers">Create New User</h1>
        </div>
        <div>
          <table>
            <tbody>
              <tr>
                <td>First Name:</td>
                <td>
                  <input
                    type="text"
                    placeholder="Letters only"
                    onChange={(e) => this.handleFirstName(e)}
                  />
                </td>
                <td>{isValidFirst ? "" : "Please enter valid First Name"}</td>
              </tr>
              <tr>
                <td>Last Name:</td>
                <td>
                  <input
                    type="text"
                    placeholder="Letters only"
                    onChange={(e) => this.handleLastName(e)}
                  />
                </td>
                <td>{isValidLast ? "" : "Please enter valid Last Name"}</td>
              </tr>
              <tr>
                <td>Sex:</td>
                <td>
                  <select
                    name="sex"
                    id="sex"
                    onChange={(e) => this.setState({ sex: e.target.value })}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Transgender">Transgender</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>Age:</td>
                <td>
                  <input type="text" onChange={(e) => this.handleAge(e)} />
                </td>
                <td>{isValidAge ? "" : "Please enter valid range 0 - 120"}</td>
              </tr>
              <tr>
                <td>Password:</td>
                <td>
                  <input
                    type="password"
                    placeholder="Enter password"
                    onChange={(e) => this.handlePwd(e)}
                  />
                </td>
                <td>
                  {isValidPwd && isValidPwdLength
                    ? ""
                    : "Please enter valid password with number and letters. The length is 8 - 20."}
                </td>
              </tr>
              <tr>
                <td>Repeat:</td>
                <td>
                  <input
                    type="password"
                    placeholder="Enter password again"
                    onChange={(e) => this.handleRepeat(e)}
                  />
                </td>
                <td>
                  {isValidRepeat
                    ? ""
                    : "Please make sure the password and repeat is consistent."}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className={isValidEntry ? "submit-button" : "submit-disable-button"}
            onClick={() => this.submitUser()}
          >
            <i className="fas fa-user-alt"></i> Create User
          </button>
        </div>
      </div>
    );
  }
}

export default connect(null)(AddUser);
