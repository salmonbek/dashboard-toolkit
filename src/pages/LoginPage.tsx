import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Flex, Form, Input, message } from "antd";

import axios from "axios";
// import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";

import { TOKEN, USER } from "../constants";
import { AuthContext } from "../context/AuthContext";
import User from "../types/user";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const onFinish = async (values: User) => {
    try {
      setLoading(true);

      const { data } = await axios.post<{ token: string }>(
        "https://reqres.in/api/login",
        // login data from server
        values,
      );
      Cookies.set(TOKEN, data.token);
      localStorage.setItem(USER, JSON.stringify(values));
      setIsAuthenticated(true);
      setUser(values);
      navigate("/categories");
    } catch (err) {
      message.error("Error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Flex align="center" justify="center" style={{ height: "100vh" }}>
      <Form
        name="basic"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item<User>
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<User>
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item style={{ width: "100%" }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default LoginPage;
