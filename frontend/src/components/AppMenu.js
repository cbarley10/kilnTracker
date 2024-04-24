import React from "react";
import { Menu, Layout } from "antd";
import { Link } from "react-router-dom";
import {
  PlusSquareOutlined,
  AppstoreAddOutlined
} from "@ant-design/icons";
import GoogleAuth from "./GoogleAuth";

const { Sider } = Layout;

const AppMenu = ({ collapsed, login, profile, logOut }) => {
  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between"
        }}>
        <div>
          <Link to="/">
            <div className="logo" />
          </Link>
          <Menu
            theme="dark"
            mode="inline"
            items={[
              {
                key: "1",
                icon: <PlusSquareOutlined />,
                label: <Link to="/create">Log new Kiln Firing</Link>
              },
              {
                key: "2",
                icon: <AppstoreAddOutlined />,
                label: <Link to="/integrations">Integrations</Link>
              }
            ]}
          />
        </div>
        <GoogleAuth
          collapsed={collapsed}
          profile={profile}
          logOut={logOut}
          login={login}
        />
      </div>
    </Sider>
  );
};

export default AppMenu;
