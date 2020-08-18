const AssistantV2 = require("ibm-watson/assistant/v2");
const { IamAuthenticator } = require("ibm-watson/auth");

console.log(process.env.ASSISTANT_IAM_APIKEY);

const assistant = new AssistantV2({
  authenticator: new IamAuthenticator({
    apikey: process.env.ASSISTANT_IAM_APIKEY,
  }),
  version: "2019-02-28",
  url: process.env.ASSISTANT_URL,
  disableSslVerification:
    process.env.DISABLE_SSL_VERIFICATION === "true" ? true : false,
});

module.exports = assistant;
