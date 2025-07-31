import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import { Main, Booking, Login, Admin, MyPage } from "./page";
import "./style/index.scss";

import "./App.scss";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/booking/:roomId" element={<Booking />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
