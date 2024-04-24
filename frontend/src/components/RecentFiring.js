import React from "react";
import { useLocation } from "react-router-dom";
import { Layout, Typography, Descriptions } from "antd";
import { formatDate } from "../utils/helpers";
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

  const firingProperties = [
    {
      key: "2",
      label: "Start Date",
      children: formatDate(dateStart)
    },
    {
      key: "1",
      label: "Cone Level",
      children: coneLevel
    },
    {
      key: "3",
      label: "Firing Schedule Preset?",
      children: firingSchedulePreset ? "yes" : "no"
    },
    {
      key: "4",
      label: "Firing Schedule Preset Name",
      children: firingSchedulePresetName ?? "none"
    },
    {
      key: "5",
      label: "Percent Full",
      children: percentFull
    },
    {
      key: "6",
      label: "Total Time Elapsed",
      children: totalTime
    },
    {
      key: "7",
      label: "Type of Firing",
      children: type
    },
    {
      key: "8",
      label: "Notes",
      children: notes,
      span: 10
    }
  ];

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
