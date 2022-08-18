export const catchConsoleError = (page) => {
  // refer https://github.com/puppeteer/puppeteer/issues/3397
  page.on("console", async (msg) => {
    if (msg.type() != "error") {
      return;
    }
    const args = await msg.args();
    args.forEach(async (arg) => {
      const val = await arg.jsonValue();
      // value is unserializable (or an empty oject)
      if (JSON.stringify(val) === JSON.stringify({})) {
        const { type, subtype, description } = arg._remoteObject;
        console.log(
          `type: ${type}, subtype: ${subtype}, description:\n ${description}`
        );
        throw description;
      }
    });
  });
};
