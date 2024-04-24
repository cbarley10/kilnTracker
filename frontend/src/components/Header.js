import React from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout } from "antd";
const { Header } = Layout;

const WebsiteHeader = ({ colorBgContainer, collapsed, setCollapsed }) => {
  return (
    <Header
      style={{
        padding: 0,
        background: colorBgContainer
      }}>
      {collapsed ? (
        <MenuUnfoldOutlined
          className="trigger"
          onClick={() => setCollapsed(!collapsed)}
        />
      ) : (
        <MenuFoldOutlined
          className="trigger"
          onClick={() => setCollapsed(!collapsed)}
        />
      )}
      <strong style={{ fontSize: "1.5em" }}>kilnTracker™</strong>
    </Header>
  );
};

export default WebsiteHeader;
