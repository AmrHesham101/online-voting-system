import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
//import Users from "./user/pages/Users";
//import NewTopic from "./topics/pages/NewTopic";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
//import UserTopics from "./topics/pages/UserTopics";
//import UpdateTopic from "./topics/pages/UpdateTopic";
//import Auth from "./user/pages/Auth";
import { AuthContext } from "./shared/context/auth-context";
import { ThemeProvider } from "./shared/context/theme-context";

import { useAuth } from "./shared/hooks/auth-hook";
import React, { Suspense } from "react";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";
const Topics = React.lazy(() => import("./topics/pages/Topics"));
const Auth = React.lazy(() => import("./user/pages/Auth"));
const NewTopic = React.lazy(() => import("./topics/pages/NewTopic"));
const UpdateTopic = React.lazy(() => import("./topics/pages/UpdateTopic"));
function App() {
  const { token, userId, login, logout } = useAuth();
  let routes;
  if (token) {
    routes = (
      <Switch>
        <Route path="/AllTopics" exact>
          <Topics filtered={false} />
        </Route>
        <Route path="/" exact>
          <Topics filtered />
        </Route>
        <Route path="/topics/new" exact>
          <NewTopic />
        </Route>
        <Route path="/topics/:topicId" exact>
          <UpdateTopic />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/AllTopics" exact>
          <Topics  filtered={false}/>
        </Route>
        {/* this will become All Topics */}
        <Route path="/" exact>
          <Topics filtered />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <ThemeProvider>
        <Router>
          <MainNavigation />
          <main>
            <Suspense
              fallback={
                <div className="center">
                  <LoadingSpinner />
                </div>
              }
            >
              {routes}
            </Suspense>
          </main>
        </Router>
      </ThemeProvider>
    </AuthContext.Provider>
  );
}

export default App;
