import { ConsoleMessage, Page, JSHandle } from "puppeteer";
import { jest, describe, beforeAll, afterAll, it, expect } from "@jest/globals";

//for 1st call to firebase eumulator tooks more than 60 secs.
export const testWaitTime = 70 * 1000; // 1 test 70secs
jest.setTimeout(testWaitTime + 10 * 1000); //total 80secs

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

export function pause(seconds) {
  return new Promise((res) => setTimeout(res, 1000 * seconds));
}
