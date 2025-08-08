"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Slack Connect Backend is Running");
});
// OAuth redirect route
app.get("/api/slack/oauth_redirect", async (req, res) => {
    const code = req.query.code;
    if (!code) {
        return res.status(400).send("Missing code from Slack OAuth");
    }
    try {
        const response = await axios_1.default.post("https://slack.com/api/oauth.v2.access", null, {
            params: {
                code,
                client_id: process.env.SLACK_CLIENT_ID,
                client_secret: process.env.SLACK_CLIENT_SECRET,
                redirect_uri: process.env.SLACK_REDIRECT_URI,
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        const { access_token } = response.data;
        if (!access_token) {
            return res.status(401).send("Slack OAuth failed");
        }
        res.redirect(`http://localhost:3000/success?token=${access_token}`);
    }
    catch (err) {
        const error = err;
        console.error("OAuth error:", error.response?.data || error.message);
        res.status(500).send("OAuth failed");
    }
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
