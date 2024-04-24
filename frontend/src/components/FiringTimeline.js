import React from "react";
import { Timeline } from "antd";
import { formatDate } from "../utils/helpers";

const FiringTimeline = ({ firings }) => {
  const items = firings.map((item) => ({
    label: formatDate(item.dateStart),
    children: item.title,
    color: item.type === "glaze" ? "blue" : "gray"
  }));
  return <Timeline mode="left" items={items} reverse />;
};

export default FiringTimeline;
