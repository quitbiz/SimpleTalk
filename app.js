const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const axios = require("axios"); // import the 'axios' library

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("chat message", (msg) => {
    sendMessage(msg).then(response => {
      let message = response.data.choices.map(choice => {
        return choice.text;
      } ).join(" ");
      io.emit("chat message", `ChatGPT: ${message}`);
    });
  });
});

const sendMessage = async (msg) => {
  const prompt = `Conversation with ChatGPT:\nUser: ${msg}\nChatGPT:`;
  const apiUrl = "https://api.openai.com/v1/engines/davinci-codex/completions";
  const response = await axios.post(apiUrl, {
    prompt,
    max_tokens: 100,
    n: 1,
    stop: "\n",
  }, {
    headers: {
      "Authorization": "Bearer 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",
    }
  });
  return response;
};

server.listen(3000, () => {
  console.log("Listening on *:3000");
});
