import React from "react";
import { useLocation } from "react-router-dom";
import { Layout, Typography, Descriptions } from "antd";
import { formatDate } from "../utils/helpers";
import { CREATE_DEFAULT_FIRING_PROPERTIES } from "../constants";
const { Title } = Typography;
const { Content } = Layout;

const RecentFiring = () => {
  const {
    state: {
      coneLevel,
      dateStart,
      firingSchedulePreset,
      firingSchedulePresetName,
      percentFull,
      title,
      totalTime,
      type,
      notes
    }
  } = useLocation();

  const firingProperties = CREATE_DEFAULT_FIRING_PROPERTIES(
    formatDate,
    dateStart,
    coneLevel,
    firingSchedulePreset,
    firingSchedulePresetName,
    percentFull,
    totalTime,
    type,
    notes
  );

  return (
    <Content
      style={{
        margin: "24px 16px",
        padding: "24px 100px",
        minHeight: 200
      }}>
      <Title level={3} className="homepage-header">
        {title}
        <hr />
      </Title>
      <Descriptions
        items={firingProperties}
        bordered
        layout="vertical"
        labelStyle={{ fontWeight: "bold" }}
      />
    </Content>
  );
};

export default RecentFiring;
