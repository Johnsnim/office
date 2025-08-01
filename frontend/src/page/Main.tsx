import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Reservation {
  start: string;
  end: string;
  title: string;
  user: string;
}

interface Room {
  _id: string;
  roomId: number;
  name: string;
  description: string;
  capa: number;
  reservations: Reservation[];
}

const Main: React.FC = () => {
  const baseURL = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    axios
      .get(`${baseURL}/api/rooms`)
      .then((res) => setRooms(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <div className="Main-Page">
      <div className="Main-Header">
        <p className="Main-Title">회의실 예약</p>
        <p className="Main-SubTItle">
          회의 인원에 맞는 회의실을 선택하고 예약하세요.
        </p>

        <div className="Main-UserArea">
          {user ? (
            <>
              <span className="Main-UserName">👤 {user.name}</span>
              {user.role === "admin" && (
                <div
                  className="Main-Button admin"
                  onClick={() => navigate("/admin")}
                >
                  관리자 페이지
                </div>
              )}

              <div
                className="Main-Button mypage"
                onClick={() => navigate("/mypage")}
              >
                마이페이지
              </div>
              <div className="Main-Button logout" onClick={handleLogout}>
                로그아웃
              </div>
            </>
          ) : (
            <div className="Main-Button" onClick={() => navigate("/login")}>
              로그인하기
            </div>
          )}
        </div>
      </div>

      <div className="Main-Content">
        <h2 className="Content-Title">회의실 목록</h2>
        <ul className="Content-List">
          {rooms.map((room) => (
            <li className="Content-Card" key={room.roomId}>
              <div className="Room-Info">
                <p className="Room-Name">{room.name}</p>
                <p className="Room-Description">
                  {room.description} · {room.capa} 좌석
                </p>
              </div>
              <div
                className="Room-Status available"
                onClick={() => {
                  navigate(`/booking/${room.roomId}`);
                }}
              >
                예약 가능
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Main;
