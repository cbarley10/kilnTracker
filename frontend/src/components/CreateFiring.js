import React, { useState } from "react";
import axios from "axios";
import {
  Layout,
  Typography,
  Form,
  DatePicker,
  Input,
  InputNumber,
  Select,
  Slider,
  Switch,
  Button,
  Alert
} from "antd";
const { Content } = Layout;
const { Title } = Typography;
const { TextArea } = Input;

const CreateFiring = ({ profile }) => {
  const [presetChecked, setPresetChecked] = useState(true);
  const [message, setMessage] = useState("");
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const formattedValues = {
      ...values,
      dateStart: values.dateStart.format("YYYY-MM-DDTHH:mm:ssZ"),
      totalTime: `${values.totalTime} hours`
    };

    try {
      const body = {
        email: profile.email,
        properties: formattedValues
      };
      const response = await axios.post(
        "http://localhost:4000/new-entry",
        body,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      console.log(response);
      if (response.status === 200) {
        setMessage("Success! Kiln Firing Recorded");
        form.resetFields();
        setTimeout(() => {
          setMessage("");
        }, 3000);
      }
      return response;
    } catch (e) {
      console.log(e);
    }
  };

  const onSwitchChange = (value) => {
    setPresetChecked(value);
  };

  return (
    <Content
      style={{
        margin: "24px 16px",
        padding: 24,
        minHeight: 200
      }}>
      {message && <Alert message={message} type="success" />}
      <Title level={3} className="homepage-header">
        Create New Kiln Firing Entry
        <hr />
      </Title>
      <Form
        form={form}
        styles={{ paddingTop: "30px" }}
        labelCol={{
          span: 4,
          offset: 2
        }}
        wrapperCol={{
          span: 14
        }}
        initialValues={{
          totalTime: 10,
          title: "Bisque for March 15th Drop",
          type: "bisque",
          firingSchedulePreset: true,
          firingSchedulePresetName: "Slow Bisque",
          percentFull: 75,
          notes: "lorem ipsum",
          coneLevel: "04"
        }}
        onFinish={onFinish}
        layout="horizontal">
        <Form.Item label="Title" name="title">
          <Input />
        </Form.Item>
        <Form.Item label="Type" name="type">
          <Select>
            <Select.Option value="bisque">Bisque</Select.Option>
            <Select.Option value="glaze">Glaze</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Cone Level" name="coneLevel">
          <Select>
            <Select.Option value="05">05</Select.Option>
            <Select.Option value="04">04</Select.Option>
            <Select.Option value="03">03</Select.Option>
            <Select.Option value="02">02</Select.Option>
            <Select.Option value="01">01</Select.Option>
            <Select.Option value="1">1</Select.Option>
            <Select.Option value="2">2</Select.Option>
            <Select.Option value="3">3</Select.Option>
            <Select.Option value="4">4</Select.Option>
            <Select.Option value="5">5</Select.Option>
            <Select.Option value="6">6</Select.Option>
            <Select.Option value="7">7</Select.Option>
            <Select.Option value="8">8</Select.Option>
            <Select.Option value="9">9</Select.Option>
            <Select.Option value="10">10</Select.Option>
            <Select.Option value="10+">10+</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Firing Date" name="dateStart">
          <DatePicker />
        </Form.Item>
        <Form.Item label="Total Run Time (hours)" name="totalTime">
          <InputNumber />
        </Form.Item>
        <Form.Item
          label="Firing Schedule Preset?"
          valuePropName="checked"
          name="firingSchedulePreset">
          <Switch onChange={onSwitchChange} />
        </Form.Item>
        {presetChecked && (
          <Form.Item
            label="Firing Schedule Preset Name"
            name="firingSchedulePresetName">
            <Input />
          </Form.Item>
        )}
        <Form.Item label="Percentage Full" name="percentFull">
          <Slider step={5} />
        </Form.Item>
        <Form.Item label="Artist Notes" name="notes">
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item
          {...{
            wrapperCol: {
              span: 14,
              offset: 6
            }
          }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Content>
  );
};

export default CreateFiring;
