import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Slack Connect Backend is Running");
});

//  OAuth Redirect Handler (Updated)
app.get("/api/auth/slack/callback", async (req, res) => {
  const code = req.query.code as string;

  if (!code) {
    return res.status(400).send("Missing code from Slack OAuth");
  }

  try {
    const response = await axios.post(
      "https://slack.com/api/oauth.v2.access",
      null,
      {
        params: {
          code,
          client_id: process.env.SLACK_CLIENT_ID || "9322589173748.9343333343120",
          client_secret: process.env.SLACK_CLIENT_SECRET || "<your-client-secret>",
          redirect_uri: "https://b54c721bfad7.ngrok-free.app/api/auth/slack/callback", // update this to match your ngrok URL
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const data = response.data;

    if (!data.ok) {
      console.error("Slack OAuth Error:", data);
      return res.status(401).send(`Slack OAuth failed: ${data.error}`);
    }

    const { access_token, authed_user, team, scope } = data;

    console.log("OAuth Success:", {
      access_token,
      authed_user,
      team,
      scope,
    });


    // res.redirect(`http://localhost:3000/success?token=${access_token}`);

    res.send("Slack OAuth success! You can now use the token to interact with Slack APIs.");
  } catch (err) {
    const error = err as any;
    console.error("OAuth exception:", error.response?.data || error.message);
    res.status(500).send("Slack OAuth failed due to server error.");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
