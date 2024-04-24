import React, { useState, useEffect } from "react";
import {
  Outlet,
  Navigate,
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import { Layout, theme } from "antd";
import axios from "axios";

import AppMenu from "./AppMenu";
import Home from "./Home";
import CreateFiring from "./CreateFiring";
import RecentFiring from "./RecentFiring";
import WebsiteHeader from "./Header";
import Integrations from "./Integrations";
import Login from "./Login";

const App = () => {
  const access_token = localStorage.getItem("access_token") || "";
  const [collapsed, setCollapsed] = useState(false);
  const [profile, setProfile] = useState({});
  const [user, setUser] = useState({});
  const [klaviyoAuthorized, setKlaviyoAuthorized] = useState(false);

  const {
    token: { colorBgContainer }
  } = theme.useToken();

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      localStorage.setItem("access_token", codeResponse.access_token);
      setUser(codeResponse);
    },
    onError: (error) => console.log("Login Failed:", error)
  });

  const logOut = () => {
    googleLogout();
    localStorage.setItem("access_token", "");
    setProfile([]);
  };

  const PrivateRoutes = () => {
    const googleAccess = localStorage.getItem("access_token");
    return googleAccess ? <Outlet /> : <Navigate to="/login" />;
  };

  useEffect(() => {
    if (localStorage.getItem("kl_access_token")) {
      setKlaviyoAuthorized(true);
    }
    if (access_token.length && !Object.keys(profile).length) {
      const fetchUser = async () => {
        try {
          const response = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`,
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
                Accept: "application/json"
              }
            }
          );
          setProfile(response.data);
        } catch (e) {
          localStorage.setItem("access_token", "");
          console.log(e);
        }
      };
      fetchUser();
    }
  }, [user, access_token]);

  return (
    <Router>
      <Layout style={{ height: "100vh" }}>
        <AppMenu
          collapsed={collapsed}
          profile={profile}
          login={login}
          logOut={logOut}
        />
        <Layout className="site-layout">
          <WebsiteHeader
            colorBgContainer={colorBgContainer}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />
          <Routes>
            <Route element={<PrivateRoutes />}>
              <Route exact path="/" element={<Home profile={profile} />} />
              <Route
                exact
                path="/create"
                element={<CreateFiring profile={profile} />}
              />
              <Route path={"/firing/:id"} element={<RecentFiring />} />
              <Route
                path={"/integrations"}
                element={
                  <Integrations
                    klaviyoAuthorized={klaviyoAuthorized}
                    profile={profile}
                  />
                }
              />
            </Route>
            <Route path={"/login"} element={<Login user={user} />}></Route>
          </Routes>
        </Layout>
      </Layout>
    </Router>
  );
};
export default App;
