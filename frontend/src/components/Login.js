import React, { useEffect } from "react";
import { Layout, Typography, Image } from "antd";
const { Content } = Layout;
const { Title, Paragraph } = Typography;

const Login = ({ user }) => {
  useEffect(() => {
    if (localStorage.getItem("access_token") || user.access_token) {
      window.location.href = "/";
    }
  }, [user]);

  return (
    <Content
      style={{
        margin: "24px 16px",
        padding: "24px 100px",
        minHeight: 200
      }}>
      <Title level={3} className="homepage-header">
        Please Login with Google to view the app!
        <hr />
      </Title>
      <div className="login">
        <Paragraph>
          In the meantime, here's a quick view of my pottery!
        </Paragraph>
        <Paragraph>
          Check it out at{" "}
          <a
            href="https://bostonpots.com"
            target="_blank"
            rel="noreferrer">
            bostonpots.com
          </a>
        </Paragraph>
        <Image width={200} src="../../pottery.jpeg" />
      </div>
    </Content>
  );
};

export default Login;
