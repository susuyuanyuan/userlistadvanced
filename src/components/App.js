import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { UserList } from "./UserList.js";
import { UserPage } from "./UserPage.js";

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <Switch>
          <Route exact path="/" component={UserList} />
          <Route exact path="/UserPage" component={UserPage} />
          <Route exact path="/EditUserPage/:id" component={UserPage} />
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default App;
