import React from "react";
import { useNavigate } from "react-router-dom";

const BackToMainBtn: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="Room-Back"
      onClick={() => {
        navigate("/");
      }}
    >
      ↩️ 메인페이지로
    </div>
  );
};

export default BackToMainBtn;
