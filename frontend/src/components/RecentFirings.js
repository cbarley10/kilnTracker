import React from "react";
import { Table } from "antd";
import { formatDate } from "../utils/helpers";

const columns = [
  {
    title: "Title",
    dataIndex: "title",
    key: "title"
  },
  {
    title: "Date",
    dataIndex: "dateStart",
    key: "dateStart"
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type"
  },
  {
    title: "Percent Full",
    dataIndex: "percentFull",
    key: "percentFull"
  },
  {
    title: "Elapsed Time",
    dataIndex: "totalTime",
    key: "totalTime"
  },
  {
    title: "Cone",
    dataIndex: "coneLevel",
    key: "coneLevel"
  },
  {
    title: "View",
    dataIndex: "view",
    key: "view"
  }
];

const RecentFirings = ({ firings }) => {
  const formattedFirings = firings.map((item) => ({
    ...item,
    key: item.title,
    dateStart: formatDate(item.dateStart)
  }));
  return (
    <Table
      dataSource={formattedFirings}
      columns={columns}
      pagination={{ pageSize: 5 }}
    />
  );
};

export default RecentFirings;
