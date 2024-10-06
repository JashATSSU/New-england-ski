import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/signup`;

const Register = () => {
  const [data, setData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [light, setLight] = useState(false);
  const [bgColor, setBgColor] = useState("bg-gray-800");
  const [bgText, setBgText] = useState("Light Mode");

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  useEffect(() => {
    if (light) {
      setBgColor("bg-white");
      setBgText("Dark Mode");
    } else {
      setBgColor("bg-gray-800");
      setBgText("Light Mode");
    }
  }, [light]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: res } = await axios.post(url, data);
      const { accessToken } = res;
      // store token in localStorage
      navigate("/login");
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <section className={`h-screen flex items-center justify-center ${bgColor}`}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                onChange={handleChange}
                placeholder="Enter username"
                className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <Form.Text className="text-gray-500">
                We just might sell your data.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                onChange={handleChange}
                placeholder="Enter Email Please"
                className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <Form.Text className="text-gray-500">
                We just might sell your data.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </Form.Group>

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600"
                onChange={() => {
                  setLight(!light);
                }}
              />
              <label className="ml-2 text-gray-700">{bgText}</label>
            </div>

            {error && (
              <div className="text-red-500 mb-4">{error}</div>
            )}
            <Button
              variant="primary"
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Register
            </Button>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default Register;
