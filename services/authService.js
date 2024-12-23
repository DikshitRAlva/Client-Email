const { ConfidentialClientApplication } = require('@azure/msal-node');
require('dotenv').config();

const msalConfig = {
  auth: {
    clientId: process.env.CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.TENANT_ID}`,
    clientSecret: process.env.CLIENT_SECRET,
  },
};

const msalClient = new ConfidentialClientApplication(msalConfig);

const getAuthUrl = () => {
  return msalClient.getAuthCodeUrl({
    scopes: ['https://graph.microsoft.com/Mail.ReadWrite', 'offline_access'],
    redirectUri: `${process.env.BASE_URL}/api/auth/callback`,
  });
};

const acquireTokenByCode = async (code) => {
  return msalClient.acquireTokenByCode({
    code,
    scopes: ['https://graph.microsoft.com/Mail.ReadWrite', 'offline_access'],
    redirectUri: `${process.env.BASE_URL}/api/auth/callback`,
  });
};

module.exports = { getAuthUrl, acquireTokenByCode };
