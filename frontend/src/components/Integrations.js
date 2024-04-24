import React, { useEffect, useState } from "react";
import axios from "axios";
import { Layout, Typography, Card, Button, Alert } from "antd";
import { useSearchParams } from "react-router-dom";
import {
  ApiOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DisconnectOutlined
} from "@ant-design/icons";
import { Link } from "react-router-dom";
const { Meta } = Card;
const { Content } = Layout;
const { Title } = Typography;

const Integrations = ({ klaviyoAuthorized, profile }) => {
  const [message, setMessage] = useState("");
  const runHistoricalSync = async (person) => {
    try {
      const body = {
        email: person.email
      };
      const response = await axios.post(
        "http://localhost:4000/historical-sync",
        body,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      if (response.data.successes) {
        setMessage(
          `Historical Sync Complete - Successes: ${response.data.successes} failures: ${response.data.failures}`
        );
        setTimeout(() => {
          setMessage("");
        }, 5000);
      }
      return response;
    } catch (e) {
      console.log(e);
    }
  };

  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    const kl_token = searchParams.get("kl_token");
    const removedIntegration = searchParams.get("success");
    if (kl_token) {
      const decodedAuth = JSON.parse(atob(kl_token));
      localStorage.setItem("kl_access_token", decodedAuth.access_token);
      localStorage.setItem("kl_refresh_token", decodedAuth.refresh_token);
    }

    if (removedIntegration) {
      localStorage.setItem("kl_access_token", "");
      localStorage.setItem("kl_refresh_token", "");
    }
  }, []);

  return (
    <Content
      style={{
        margin: "24px 16px",
        padding: "24px 100px",
        minHeight: 200
      }}>
      {message && <Alert message={message} type="success" />}
      <Title level={3} className="homepage-header">
        Integrations
        <hr />
      </Title>
      <Card
        style={{
          width: 300
        }}
        cover={<img alt="example" src="../../klaviyo-logo.jpeg" />}
        actions={
          !klaviyoAuthorized
            ? [
                <Link to={`http://localhost:4000/oauth/klaviyo/authorize`}>
                  Connect Integration <ApiOutlined key="Connect" />
                </Link>
              ]
            : [
                <Link
                  to={`http://localhost:4000/oauth/klaviyo/remove?token=${localStorage.getItem(
                    "kl_refresh_token"
                  )}`}>
                  Remove <DisconnectOutlined key="Disconnect" />
                </Link>
              ]
        }>
        <Meta
          title="Klaviyo"
          description={
            klaviyoAuthorized ? (
              <>
                <p style={{ color: "green" }}>
                  <CheckCircleOutlined /> Enabled
                </p>
                <Button
                  type="primary"
                  size="sm"
                  onClick={() => runHistoricalSync(profile)}>
                  Run Historical Sync
                </Button>
              </>
            ) : (
              <>
                <p style={{ color: "red" }}>
                  <CloseCircleOutlined /> Not Enabled.
                </p>
                <p>
                  Click the button below to connect your Klaviyo account
                </p>
              </>
            )
          }
        />
      </Card>
    </Content>
  );
};

export default Integrations;
