const GOOGLE_AUTH_CLIENT =
  "200070843501-1tfs6sergi9p8430ug62bahgdf9hodnt.apps.googleusercontent.com";

const DEV_URL = "http://localhost:4000";

const FORM_INITIAL_VALUES = {
  totalTime: 10,
  title: "Bisque for March 15th Drop",
  type: "bisque",
  firingSchedulePreset: true,
  firingSchedulePresetName: "Slow Bisque",
  percentFull: 75,
  notes: "lorem ipsum",
  coneLevel: "04"
};

const CREATE_DEFAULT_FIRING_PROPERTIES = (
  formatDate,
  dateStart,
  coneLevel,
  firingSchedulePreset,
  firingSchedulePresetName,
  percentFull,
  totalTime,
  type,
  notes
) => {
  return [
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
};

const RECENT_FIRING_COLUMNS = [
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

export {
  GOOGLE_AUTH_CLIENT,
  DEV_URL,
  FORM_INITIAL_VALUES,
  CREATE_DEFAULT_FIRING_PROPERTIES,
  RECENT_FIRING_COLUMNS
};
