import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BackToMainBtn } from "../components";

const Login: React.FC = () => {
  const baseURL = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${baseURL}/api/login`, {
        userName: id,
        password: password,
      });

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      alert("로그인 되었습니다.");
      navigate("/");
    } catch (error) {
      alert("아이디 또는 비밀번호가 틀렸습니다.");
    }
  };

  return (
    <div className="Login-Page">
      <div className="Login-Card">
        <BackToMainBtn />
        <h2 className="Login-Title">로그인</h2>
        <p className="Login-Description">ID와 Password를 입력해주세요.</p>
        <div className="Login-Form">
          <input
            type="text"
            placeholder="아이디"
            className="Login-Input"
            onChange={(e) => setId(e.target.value)}
          />
          <input
            type="password"
            placeholder="비밀번호"
            className="Login-Input"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="Login-Button" onClick={handleLogin}>
            로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
