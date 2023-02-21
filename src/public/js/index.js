const socket = io();

let user;
const chatBox = document.querySelector("#chatBox");
chatBox.focus();

Swal.fire({
  title: "Identificate",
  input: "text",
  text: "Ingresa un nombre de usuario",
  inputValidator: (value) =>
    !value && "Necesitas escribir un nombre de usuario",
  allowOutsideClick: false,
}).then((result) => {
  user = result.value;
  socket.emit("authenticated", user);
});

chatBox.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    if (chatBox.value.trim().length > 0) {
      socket.emit("message", {
        user,
        message: chatBox.value,
      });
      chatBox.value = "";
      chatBox.focus();
    }
  }
});

socket.on("messageLogs", (data) => {
  if (!user) return;
  let log = document.querySelector("#messageLogs");
  let messages = "";
  data.forEach((message) => {
    messages += `
  <div class="card mb-3">
    <div class="card-body">
      <h5 class="card-title">${message.user}</h5>
      <p class="card-text">${message.message}</p>
      <p class="card-text text-muted text-end">${message.time}<p/>
    </div>
  </div>`;
  });
  log.innerHTML = messages;
});

socket.on("newUserConnected", (data) => {
  if (!user) return;
  Swal.fire({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    title: `${data} se ha unido al chat`,
    icon: "success",
  });
});
