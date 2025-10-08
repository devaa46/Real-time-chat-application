const socket = io("https://your-backend-url.onrender.com");
let username = "";

function register() {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();
  if (!user || !pass) return alert("Please fill all fields!");
  alert("Registered successfully! Now login.");
}

function login() {
  username = document.getElementById("username").value.trim();
  if (!username) return alert("Enter username!");
  document.getElementById("auth-container").style.display = "none";
  document.getElementById("chat-container").style.display = "block";
}

function sendMessage() {
  const msgInput = document.getElementById("msgInput");
  const message = msgInput.value.trim();
  if (!message) return;

  const data = { user: username, text: message };
  socket.emit("sendMessage", data);
  msgInput.value = "";
}

socket.on("receiveMessage", (data) => {
  const messages = document.getElementById("messages");
  const msgDiv = document.createElement("div");
  msgDiv.className = data.user === username ? "message sent" : "message received";
  msgDiv.textContent = `${data.user}: ${data.text}`;
  messages.appendChild(msgDiv);
  messages.scrollTop = messages.scrollHeight;
});

socket.on("loadMessages", (msgs) => {
  const messages = document.getElementById("messages");
  messages.innerHTML = "";
  msgs.forEach((data) => {
    const msgDiv = document.createElement("div");
    msgDiv.className = data.user === username ? "message sent" : "message received";
    msgDiv.textContent = `${data.user}: ${data.text}`;
    messages.appendChild(msgDiv);
  });
  messages.scrollTop = messages.scrollHeight;
});
