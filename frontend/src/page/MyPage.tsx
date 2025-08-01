import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
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

const MyPage: React.FC = () => {
  const baseURL = process.env.REACT_APP_API_BASE_URL;
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const storedUser = localStorage.getItem("user");
  const currentUserName = storedUser ? JSON.parse(storedUser).name : "";

  const fetchData = async () => {
    const res = await axios.get(`${baseURL}/api/rooms`);
    setRooms(res.data);
    if (res.data.length > 0) {
      setSelectedRoomId(res.data[0]._id);
      setSelectedRoom(res.data[0]);
    }
  };

  const handleDelete = async (roomId: number, reservationId: string) => {
    try {
      await axios.delete(
        `${baseURL}/api/rooms/${roomId}/reservations/${reservationId}`
      );
      alert("예약을 삭제했습니다.");
      fetchData();
    } catch (err) {
      alert("삭제에 실패했습니다.");
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
        <p className="Admin-Title">마이페이지</p>
        <p className="Admin-SubTItle">
          내가 등록한 회의 예약을 조회하고 삭제할 수 있습니다.
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
          {selectedRoom.reservations.filter((r) => r.user === currentUserName)
            .length === 0 ? (
            <div className="Admin-EmptyRes">등록한 예약이 없습니다.</div>
          ) : (
            <ul className="Admin-ReservationList">
              {selectedRoom.reservations
                .filter((r) => r.user === currentUserName)
                .map((r) => (
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

export default MyPage;
