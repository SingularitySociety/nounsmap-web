import { ConsoleMessage, Page, JSHandle } from "puppeteer";

export const catchConsoleError = (page) => {
  // refer https://github.com/puppeteer/puppeteer/issues/3397
  //  and https://github.com/puppeteer/puppeteer/issues/3328#issuecomment-806869319

  // make args accessible
  const describe = (jsHandle) => {
    return jsHandle.executionContext().evaluate((obj) => {
      // serialize |obj| however you want
      return `OBJ: ${typeof obj}, ${obj}`;
    }, jsHandle);
  };
  page.on("console", async (msg) => {
    if (msg.type() != "error") {
      return;
    }
    console.error(msg.text());
    const args = await Promise.all(msg.args().map((arg) => describe(arg)));
    let text = "";
    for (let i = 0; i < args.length; ++i) {
      text += `[${i}] ${args[i]} `;
    }
    console.log(`${msg.text()}\n${text}`);
    throw msg.text() + text;
  });
};
