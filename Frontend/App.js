import React from "react";

function App() {
 const handleLogin = () => {
  const clientId = "9322589173748.9343333343120";
  const redirectUri = "https://b54c721bfad7.ngrok-free.app/api/auth/slack/callback";
  const scope = "chat:write,channels:read,users:read";

  const slackUrl = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}`;

  window.location.href = slackUrl;
};
  

  return (
    <div style={{ padding: 50 }}>
      <h1>Slack Connect App</h1>
      <button onClick={handleLogin}>Sign in with Slack</button>
    </div>
  );
}

export default App;
