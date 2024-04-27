import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout, Typography } from "antd";
import axios from "axios";

import RecentFirings from "./RecentFirings";
import FiringTimeline from "./FiringTimeline";
import { DEV_URL } from "../constants";

const { Title } = Typography;
const { Content } = Layout;

const Home = ({ profile }) => {
  const [firings, setFirings] = useState([]);
  useEffect(() => {
    const getFirings = async () => {
      try {
        if (profile.email) {
          const results = await axios.get(
            `${DEV_URL}/recent-firings?e=${profile.email}`
          );
          const recentFirings = results.data.map((item) => {
            return {
              ...item,
              view: (
                <Link
                  to={`/firing/${item.title
                    .toLowerCase()
                    .split(" ")
                    .join("-")}`}
                  state={{ ...item }}>
                  View
                </Link>
              )
            };
          });
          setFirings(recentFirings);
          return recentFirings;
        }
      } catch (e) {
        console.log(e);
      }
    };
    getFirings();
  }, []);

  return (
    <>
      <Content
        style={{
          margin: "24px 16px",
          padding: 24,
          minHeight: 200
        }}>
        <Title level={3} className="homepage-header">
          Timeline
          <hr />
        </Title>
        <FiringTimeline firings={firings} />
      </Content>
      <Content
        style={{
          margin: "24px 16px",
          padding: 24,
          minHeight: 280
        }}>
        <Title level={3} className="homepage-header">
          Recent Firings
          <hr />
        </Title>
        <RecentFirings firings={firings} />
      </Content>
    </>
  );
};

export default Home;
