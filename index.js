const express = require('express');
const { GoogleAuth } = require('google-auth-library');
const app = express();
const PORT = process.env.PORT || 3000;

const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);

app.get('/token', async (req, res) => {
  try {
    const auth = new GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const client = await auth.getClient();
    const accessTokenResponse = await client.getAccessToken();
    const token = accessTokenResponse.token;

    if (!token) {
      return res.status(500).json({ error: 'Unable to obtain access token' });
    }

    return res.json({ access_token: token });
  } catch (err) {
    console.error('❌ Token generation failed:', err);
    return res.status(500).json({ error: 'Token generation failed' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Token Relay API running on port ${PORT}`);
});
