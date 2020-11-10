import React, { Component, useState } from "react";
import { connect } from 'react-redux';
import { Link } from "react-router-dom";

import { getUsers, deleteUser, sortUsersAction, searchUserAction } from '../actions/index.js';
import './styles.css';

Const UserList = ({users, history, dispatch}) => {

    // delete user
    const deleteUser = (id) => {
        const { dispatch } = this.props;
        dispatch(deleteUser(id));
    }

    // sort in back end
    const sortIcon = (col_name, col_id, is_numeric) => {
        const ASC = -1;
        const DSC = 1;
        const cname = "fas fa-sort-" + (is_numeric ? "numeric" : "alpha") + "-down";
        const { dispatch } = this.props;
        return (
            <th>
                {col_name}
                <button className="ml-1" onClick={() => dispatch(sortUsersAction(col_id, ASC))}>
                    <i className={cname}></i>
                </button>
                <button className="ml-1" onClick={() => dispatch(sortUsersAction(col_id, DSC))}>
                    <i className={cname + "-alt"}></i>
                </button>
            </th>
        );
    };

    const renderTable = () => {
        const currentUsers = users;

        return (
            <div className="text-center">
                <table className="table table-striped">
                    <thead className="thead-primary">
                        <tr className="thead">
                            <th>Avatar</th>
                            {sortIcon("Name", "name", false)}
                            {sortIcon("Sex", "sex", false)}
                            {sortIcon("Rank", "rank", false)}
                            {sortIcon("Start Date", "stdat", false)}
                            {sortIcon("Phone", "phone", false)}
                            {sortIcon("Email", "email", true)}
                            {sortIcon("Superior", "superior", true)}
                            {sortIcon("# of D. S.", "ds", true)}
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map(user => {
                            return (
                                <tr key={user._id} className="text-capitalize">
                                    <td>{user.avatar}</td>
                                    <td>{user.name}</td>
                                    <td>{user.sex}</td>
                                    <td>{user.rank}</td>
                                    <td>{user.stdat}</td>
                                    <td>{user.phone}</td>
                                    <td>{user.email}</td>
                                    <td>{user.superior}</td>
                                    <td>{user.ds}</td>
                                    <td>
                                        <button className="btn btn-light text-primary">
                                            <Link to={{
                                                pathname: `/editUser/${user._id}`,
                                                state: user,
                                            }}><i className='fas fa-pencil-alt'></i> Edit</Link>
                                        </button>
                                    </td>
                                    <td>
                                        <button className="btn btn-light text-danger" onClick={() => deleteUser(user._id)}>
                                            <i className='fas fa-trash-alt'></i> Delete
                                        </button>
                                    </td>
                                </tr>);
                        })
                        }
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="grid-container">
            <div className="headers">
                <h1>US Army Personnel Registry</h1>
            </div>
            <div>
                <div className="ui row ml-4" style={{ fontSize: "20px" }}>
                    <input
                        type="text"
                        placeholder="search"
                        onChange={e => dispatch(searchUserAction(e.target.value))}
                    />
                </div>
                <div>
                    <button>Reset</button>
                </div>
                <div>
                    <form method="get" action="/addUser">
                        <button type="submit" className="submit-button">New Soldier</button>
                    </form>
                </div>
            </div>
            <div className="ui divided list">
                {renderTable()}
            </div>
        </div>
    );

//     render() {
//         const { users, dispatch } = this.props;
//         const { usersPerPage, currentPage } = this.state;
//         const pageNumbers = [];
//         const recordsPerPage = [5, 10, 15]
//         for (let i = 1; i <= Math.ceil(users.length / usersPerPage); i++) {
//             pageNumbers.push(i);
//         }
//     }
// };
};


const mapStateToProps = state => {
    return { users: state.displayData };
};

export default connect(mapStateToProps)(UserList);

    // componentDidMount() {
    //     const { dispatch } = this.props;
    //     dispatch(getUsers());
    // }

    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         currentPage: 1,
    //         usersPerPage: 5,
    //     }
    // }


