const { ConfidentialClientApplication } = require("@azure/msal-node");
require("dotenv").config();

const msalConfig = {
    auth: {
        clientId: process.env.CLIENT_ID,
        authority: `https://login.microsoftonline.com/${process.env.TENANT_ID}`,
        clientSecret: process.env.CLIENT_SECRET,
    },
};

const msalClient = new ConfidentialClientApplication(msalConfig);
module.exports = msalClient;
