import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format, isSameDay, parseISO } from "date-fns";
import axios from "axios";
import { BackToMainBtn } from "../components";

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

const Booking: React.FC = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [room, setRoom] = useState<Room | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("2025-07-30");
  const [meetingTitle, setMeetingTitle] = useState<string>("");
  const [selectedSlots, setSelectedSlots] = useState<number[]>([]);
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);
  const [disabledSlotInfo, setDisabledSlotInfo] = useState<
    Record<number, { title: string; user: string }>
  >({});

  const storedUser = localStorage.getItem("user");
  const userName = storedUser ? JSON.parse(storedUser).name : "홍길동";

  const timeSlots = Array.from({ length: 18 }, (_, i) => i);

  const formatTime = (index: number) => {
    const hour = 9 + Math.floor(index / 2);
    const minute = index % 2 === 0 ? "00" : "30";
    const suffix = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour}${minute === "30" ? ":30" : ""}${suffix}`;
  };

  const updateDisabledSlots = (reservations: Reservation[], date: string) => {
    const disabledInfo: Record<number, { title: string; user: string }> = {};
    const selected = new Date(date + "T00:00:00");

    reservations.forEach((res) => {
      const start = new Date(res.start);
      const end = new Date(res.end);

      if (isSameDay(start, selected)) {
        const startIndex =
          (start.getHours() - 9) * 2 + (start.getMinutes() === 30 ? 1 : 0);
        const endIndex =
          (end.getHours() - 9) * 2 + (end.getMinutes() === 30 ? 1 : 0);

        for (let i = startIndex; i < endIndex; i++) {
          if (i >= 0 && i < 18) {
            disabledInfo[i] = {
              title: res.title,
              user: res.user,
            };
          }
        }
      }
    });

    setDisabledSlotInfo(disabledInfo);
  };

  const handleSlotClick = (index: number) => {
    if (disabledSlotInfo[index]) return;

    if (selectedSlots.length >= 2) {
      setSelectedSlots([index]);
    } else if (selectedSlots.length === 1) {
      const first = selectedSlots[0];
      const range = first < index ? [first, index] : [index, first];
      const fullRange = Array.from(
        { length: range[1] - range[0] + 1 },
        (_, i) => range[0] + i
      );

      const isOverlapping = fullRange.some((i) => disabledSlotInfo[i]);
      if (!isOverlapping) {
        setSelectedSlots(fullRange);
      }
    } else {
      setSelectedSlots([index]);
    }
  };

  const renderSelectedTime = () => {
    if (selectedSlots.length === 0) return null;
    const start = formatTime(selectedSlots[0]);
    const end = formatTime(selectedSlots[selectedSlots.length - 1] + 1);
    return `${start} ~ ${end}`;
  };

  const handleSubmit = async () => {
    if (!roomId || selectedSlots.length === 0 || !meetingTitle) return;

    const startHour = 9 + Math.floor(selectedSlots[0] / 2);
    const startMin = selectedSlots[0] % 2 === 0 ? 0 : 30;
    const endHour =
      9 + Math.floor((selectedSlots[selectedSlots.length - 1] + 1) / 2);
    const endMin =
      (selectedSlots[selectedSlots.length - 1] + 1) % 2 === 0 ? 0 : 30;

    const start = new Date(
      `${selectedDate}T${String(startHour).padStart(2, "0")}:${String(
        startMin
      ).padStart(2, "0")}:00`
    );
    const end = new Date(
      `${selectedDate}T${String(endHour).padStart(2, "0")}:${String(
        endMin
      ).padStart(2, "0")}:00`
    );

    try {
      await axios.post(`http://localhost:5000/api/rooms/${roomId}/reserve`, {
        start: start.toISOString(),
        end: end.toISOString(),
        title: meetingTitle,
        user: userName,
      });

      alert("예약이 완료되었습니다!");
      setSelectedSlots([]);
      setMeetingTitle("");

      const res = await axios.get(`http://localhost:5000/api/rooms/${roomId}`);
      setRoom(res.data);
      updateDisabledSlots(res.data.reservations, selectedDate);
    } catch (error) {
      console.error("예약 실패:", error);
      alert("예약 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    if (!roomId) return;

    axios.get(`http://localhost:5000/api/rooms/${roomId}`).then((res) => {
      setRoom(res.data);
      updateDisabledSlots(res.data.reservations, selectedDate);
    });
  }, [roomId]);

  useEffect(() => {
    if (room) {
      updateDisabledSlots(room.reservations, selectedDate);
      setSelectedSlots([]);
    }
  }, [selectedDate]);

  return (
    <div className="Booking-Page">
      <div className="Booking-Card">
        <BackToMainBtn />
        <h2 className="Room-Title">{room?.name || `회의실 ${roomId}`}</h2>
        <p className="Room-Description">
          {room?.description} · {room?.capa} 좌석
        </p>

        <div className="Date-Row">
          <label>날짜</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div className="Time-Row">
          <label>시간</label>
          <div className="TimeBar">
            {timeSlots.map((slot) => (
              <div
                key={slot}
                className={`TimeSlot ${
                  selectedSlots.includes(slot) ? "selected" : ""
                } ${disabledSlotInfo[slot] ? "disabled" : ""}`}
                onClick={() => handleSlotClick(slot)}
                onMouseEnter={() => setHoveredSlot(slot)}
                onMouseLeave={() => setHoveredSlot(null)}
              >
                {hoveredSlot === slot && (
                  <div className="Tooltip below">
                    {disabledSlotInfo[slot]
                      ? `${disabledSlotInfo[slot].title} (${disabledSlotInfo[slot].user})`
                      : formatTime(slot)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="SelectedTime">{renderSelectedTime()}</div>

        <div className="Meeting-Row">
          <label>회의명</label>
          <input
            type="text"
            value={meetingTitle}
            onChange={(e) => setMeetingTitle(e.target.value)}
            placeholder="간략하게 회의 목적을 작성해주세요"
          />
        </div>

        <button
          className="Submit-Button"
          disabled={selectedSlots.length === 0 || !meetingTitle}
          onClick={handleSubmit}
        >
          예약하기
        </button>
      </div>
    </div>
  );
};

export default Booking;
