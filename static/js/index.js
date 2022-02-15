const socket = io();

const addMsg = (data) => {
  const chatDom = document.getElementById("chat");
  const chatChild = document.createElement("p");
  switch (data.type) {
    case "connect":
      chatChild.className = "connect";
      break;
    case "disconnect":
      chatChild.className = "disconnect";
      break;
    default:
      if (data.name === "나") {
        chatChild.className = "mychat";
      } else {
        chatChild.className = "youchat";
      }

      break;
  }
  chatChild.innerHTML = `${data.name} : ${data.message}`;
  chatDom.appendChild(chatChild);
  chatDom.scrollTop = chat.scrollHeight;
};

//접속 됐을 때 실행
socket.on("connect", () => {
  //이름을 입력 받습니다.
  let name = prompt("반갑습니다!", "");

  //이름이 빈칸이면 익명
  if (!name) {
    name = "Anonymous";
  }

  //서버에 새로운 유저가 왔다고 알림
  socket.emit("newUser", name);
});

socket.on("update", (data) => {
  console.log("업데이트 함수 실행", data);
  addMsg(data);
});

//전송 함수
function send() {
  const inputDom = document.getElementById("inputText");

  //메세지를 가져옴
  const message = inputDom.value;
  //메세지를 초기화
  inputDom.value = "";
  //서버로 send 이벤트 전달 + data와
  socket.emit("message", { type: "message", message: message });
  //내가 보낸 메시지 추가
  addMsg({ type: "message", name: "나", message: message });
}

//전송 엔터키
function enterKey() {
  if (window.event.keyCode == 13) {
    send();
    return;
  }
}
