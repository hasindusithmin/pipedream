const axios = require("axios");

module.exports = {
  type: "app",
  app: "discord_webhook",
  propDefinitions: {
    message: {
      type: "string",
      description: "Enter a simple message up to 2000 characters. This is the most commonly used field. However, it's optional if you pass embed content.",
    },
    embeds: {
      type: "any",
      description: "Optionally pass an [array of embed objects](https://birdie0.github.io/discord-webhooks-guide/discord_webhook.html). E.g., ``{{ [{\"description\":\"Use markdown including *Italic* **bold** __underline__ ~~strikeout~~ [hyperlink](https://google.com) `code`\"}] }}``. To pass data from another step, enter a reference using double curly brackets (e.g., `{{steps.mydata.$return_value}}`).\nTip: Construct the `embeds` array in a Node.js code step, return it, and then pass the return value to this step.",
      optional: true,
    },
    username: {
      type: "string",
      description: "Overrides the current username of the webhook",
      optional: true,
    },
    avatarURL: {
      type: "string",
      label: "Avatar URL",
      description: "If used, it overrides the default avatar of the webhook",
      optional: true,
    },
    threadID: {
      type: "string",
      label: "Thread ID",
      description: "If provided, the message will be posted to this thread",
      optional: true,
    },
  },
  methods: {
    url() {
      return this.$auth.oauth_uid;
    },
    async sendMessage({
      content, embeds, username, avatarURL, threadID,
    }) {
      const resp = await axios({
        method: "POST",
        url: this.url(),
        headers: {
          "Content-Type": "application/json",
        },
        validateStatus: () => true,
        params: {
          thread_id: threadID
            ? threadID
            : undefined,
        },
        data: {
          content,
          embeds,
          username,
          avatar_url: avatarURL,
        },
      });
      if (resp.status >= 400) {
        throw new Error(JSON.stringify(resp.data));
      }
      return resp.data;
    },
  },
};
