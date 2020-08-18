const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config({ silent: true });
const cors = require("cors");
const assistant = require("./watson/client");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.post("/api/message", (req, res) => {
  let assistantId = process.env.ASSISTANT_ID || "<assistant-id>";
  if (!assistantId || assistantId === "<assistant-id>")
    return res.json({
      output: {
        text:
          "The app has not been configured with a <b>ASSISTANT_ID</b> environment variable. Please refer to the " +
          '<a href="https://github.com/watson-developer-cloud/assistant-simple">README</a> documentation on how to set this variable. <br>' +
          "Once a workspace has been defined the intents may be imported from " +
          '<a href="https://github.com/watson-developer-cloud/assistant-simple/blob/master/training/car_workspace.json">here</a> in order to get a working application.',
      },
    });

  const { text } = req.body.input || "";

  const payload = {
    assistant_id: assistantId,
    session_id: req.body.session_id,
    input: {
      message_type: "text",
      text,
    },
  };

  assistant.message(payload, (err, data) => {
    if (err) {
      const status = err.code !== undefined && err.code > 0 ? err.code : 500;
      return res.status(status).json(err);
    }

    return res.json(data);
  });
});

app.get("/api/session", (req, res) => {
  assistant.createSession(
    { assistantId: process.env.ASSISTANT_ID },
    (err, response) => {
      console.log(response);
      return err ? res.send(err) : res.send(response);
    }
  );
});

app.listen(3001, () => console.log("Server running on 3001"));
