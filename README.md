<div align="center">


# 🏢 사내 회의실 예약 웹 페이지

사내 회의실 예약을 위한 간단하고 직관적인 웹 애플리케이션입니다.  
로그인을 통해 회의실 예약 및 취소가 가능하며,  
관리자는 전체 예약 현황을 조회하고 삭제할 수 있습니다.

</div>

---

## 📝 소개

- 회사 내부에서 사용할 회의실 예약 웹 서비스입니다.
- 사용자는 로그인 후 회의실을 선택하여 예약할 수 있습니다.
- 관리자 계정은 전체 예약 현황을 확인하고 예약을 삭제할 수 있습니다.
- Backend로 Node.js / Frontend로 React(Typescript) / DB로 MongoDB Atlas 사용했습니다.

---

## 🎨 화면 디자인

Figma를 통해 사전 와이어프레임을 제작하고,  
회사 내에서 사용하는 것을 상정하여 단순하고 깔끔한 UI 위주로 기능 중심의 모던한 디자인을 구현했습니다.

| 로그인 페이지 | 메인 페이지 |
|:-------------:|:-----------:|
| <img src="https://github.com/user-attachments/assets/2abf3e1b-c36f-4363-8572-9ceebab22b4b" width="400"/> | <img src="https://github.com/user-attachments/assets/2ebc4a10-f157-4113-b342-222ec5e0e384" width="400"/> |

| 예약 페이지 | 조회 페이지 (마이페이지 / 관리자 페이지) |
|:------------:|:--------------------------------------:|
| <img src="https://github.com/user-attachments/assets/3fdebd10-ef11-4647-ae7e-e2d3206c9dc4" width="400"/> | <img src="https://github.com/user-attachments/assets/0c46472c-c9e2-462b-ba78-7da5a475ffc4" width="400"/> |

---

## 🛠 기술 스택

### 🧩 Front-End

| React | TypeScript | SCSS |
|:-----:|:----------:|:----:|
| <img src="https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1567003547/noticon/skjx2bjr7yjqybwxmoxc.png" width="40"/> | <img src="https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1566913457/noticon/eh4d0dnic4n1neth3fui.png" width="40"/> | <img src="https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1567007298/noticon/zcszelqcacn0cyqpcmjm.png" width="40"/> |

### 🔧 Back-End

| Node.js | Express | MongoDB | JWT | dotenv |
|:-------:|:-------:|:-------:|:---:|:------:|
| <img src="https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1566557264/noticon/eyhvbmh82nhdoydl4j2a.png" width="40"/> | <img src="https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1597622806/noticon/avedhz3pvaij65k3ztar.png" width="40"/> | <img src="https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1566913759/noticon/rewwujgq5wuw2qohwta9.png" width="40"/> | <img src="https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1567058844/noticon/orx7ruoawimdrp5gyc35.png" width="40"/> | <img src="https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1569654347/noticon/mdujedvj9w8c9rz9phny.png" width="40"/> |

### 🛠 Tools

| Figma |
|:-----:|
| <img src="https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1608448196/noticon/a0fgk99dgqtyrwwmqsbt.png" width="40"/> |

---

## ⚙️ 프로젝트 실행 방법



## 🧠 설계 내용 및 고민한 점

### 사용자 권한 분리
일반 사용자(user)와 관리자(admin)를 JWT 토큰에 담긴 role 값으로 구분하고 별도의 관리용 페이지를 만들어 관리자만 접근 가능하도록 분리하였습니다.

### UI
사내 시스템용을 상정하여 기능성과 직관성 위주로 구성했습니다.
불필요한 인터렉션은 최소화하고 카드 기반 레이아웃에 각진 외곽선 대신 그림자로 가장자리를 만들어 모던하면서도 직관적인 디자인으로 만들고자 했습니다.

### 예약 페이지
<img width="502" height="595" alt="Image" src="https://github.com/user-attachments/assets/54a46e6e-c2aa-480a-8070-b2d219382616" />  <br />
어떤 방식으로 시간을 입력하게 해야 화면을 복잡하게 만들지 않고 적은 조작으로
시간을 선택할 수 있도록 할지를 고민했습니다. <br />

시분을 기입할 수 있는 input을 만드는 것 부터, 드롭다운으로 시간을 선택하거나 
시계 형태의 라이브러리를 가져와 사용하는 방법까지 여러 방면으로 생각해보았고,
결국 좌석 티켓팅처럼 슬롯을 만들어 시간을 선택하도록 만들었습니다.  <br />

통상적인 근무시간인 9시부터 18시까지를 30분 단위로 재단하고 18개의 슬롯으로 배치하여
별도의 드롭다운 모달이나 키보드 조작없이 직관적으로 시간을 선택할 수 있도록 하였습니다.  <br />

이 과정에서 UTC와 KST 간 변환이 너무 복잡해지고, JS 특유의 시간계산과 포맷팅에 필요한 코드가 늘어남에 따라
Date-fns 라이브러리를 적용해 명확하게 시간을 포맷팅하면서도 코드를 간략하게 줄일 수 있었습니다. 


