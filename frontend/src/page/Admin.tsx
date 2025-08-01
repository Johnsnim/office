import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { BackToMainBtn } from "../components";

interface Reservation {
  _id: string;
  title: string;
  user: string;
  start: string;
  end: string;
}

interface Room {
  _id: string;
  roomId: number;
  name: string;
  reservations: Reservation[];
}

const Admin: React.FC = () => {
  const baseURL = process.env.REACT_APP_API_BASE_URL;

  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const fetchData = async () => {
    const res = await axios.get(`https://office-backend-qcni.onrender.com
api/rooms`);
    setRooms(res.data);
    if (res.data.length > 0) {
      setSelectedRoomId(res.data[0]._id);
      setSelectedRoom(res.data[0]);
    }
  };

  const handleDelete = async (roomId: number, reservationId: string) => {
    try {
      await axios.delete(
        `https://office-backend-qcni.onrender.com/${roomId}/reservations/${reservationId}`
      );
      alert("예약 삭제 완료!");
      fetchData();
    } catch (err) {
      alert("삭제 실패");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const room = rooms.find((r) => r._id === selectedRoomId);
    setSelectedRoom(room || null);
  }, [selectedRoomId, rooms]);

  return (
    <div className="Admin-Page">
      <div className="Admin-Header">
        <BackToMainBtn />
        <p className="Admin-Title">관리자 페이지</p>
        <p className="Admin-SubTItle">
          예약된 회의를 조회하고 삭제할 수 있습니다.
        </p>
      </div>

      <div className="Room-Select-Wrapper">
        <label htmlFor="room-select">회의실 : </label>
        <select
          id="room-select"
          value={selectedRoomId}
          onChange={(e) => setSelectedRoomId(e.target.value)}
        >
          {rooms.map((room) => (
            <option key={room._id} value={room._id}>
              {room.name}
            </option>
          ))}
        </select>
      </div>

      {selectedRoom && (
        <div className="Admin-RoomCard">
          <h3 className="Admin-RoomName">{selectedRoom.name}</h3>
          {selectedRoom.reservations.length === 0 ? (
            <div className="Admin-EmptyRes">예약된 회의가 없습니다.</div>
          ) : (
            <ul className="Admin-ReservationList">
              {selectedRoom.reservations.map((r) => (
                <li key={r._id} className="Admin-ReservationItem">
                  <span className="Res-Title">📝 {r.title}</span>
                  <span className="Res-User">👤 {r.user}</span>
                  <span className="Res-Time">
                    🕒 {format(new Date(r.start), "yyyy-MM-dd HH:mm")} ~{" "}
                    {format(new Date(r.end), "HH:mm")}
                  </span>
                  <button
                    className="Res-DeleteBtn"
                    onClick={() => handleDelete(selectedRoom.roomId, r._id)}
                  >
                    삭제
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;
