import React from "react";
import { Button, Avatar } from "antd";

const GoogleAuth = ({ collapsed, profile, logOut, login }) => {
  return (
    <>
      {!collapsed && !Object.keys(profile).length ? (
        <Button
          type="primary"
          size="large"
          className="google-login"
          block
          onClick={() => login()}>
          <img src="/google.png" alt="login" />
          Login with Google
        </Button>
      ) : collapsed && !Object.keys(profile).length ? (
        <Button
          type="primary"
          size="large"
          className="google-login"
          block
          onClick={() => login()}>
          <img src="/google.png" alt="login" />
        </Button>
      ) : !collapsed && Object.keys(profile).length ? (
        <div className="profile">
          <Avatar
            size={{ xs: 24, sm: 32, md: 36, lg: 40, xl: 40, xxl: 40 }}
            src={profile.picture ?? "/profile.jpeg"}
            draggable={false}
          />
          <span>{profile.email}</span>
          <span className="logout" onClick={() => logOut()}>
            Log Out
          </span>
        </div>
      ) : (
        <div className="profile" style={{ padding: "10px" }}>
          <Avatar
            size={{ xs: 16, sm: 24, md: 32, lg: 40, xl: 50, xxl: 50 }}
            src={profile.picture}
            draggable={false}
          />
          <span className="logout" onClick={() => logOut()}>
            Log Out
          </span>
        </div>
      )}
    </>
  );
};

export default GoogleAuth;
