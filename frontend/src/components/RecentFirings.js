import React from "react";
import { Table } from "antd";
import { formatDate } from "../utils/helpers";
import { RECENT_FIRING_COLUMNS } from "../constants";

const RecentFirings = ({ firings }) => {
  const formattedFirings = firings.map((item) => ({
    ...item,
    key: item.title,
    dateStart: formatDate(item.dateStart)
  }));
  return (
    <Table
      dataSource={formattedFirings}
      columns={RECENT_FIRING_COLUMNS}
      pagination={{ pageSize: 5 }}
    />
  );
};

export default RecentFirings;
