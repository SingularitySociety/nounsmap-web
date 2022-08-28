import puppeteer from "puppeteer";
import { jest, describe, beforeAll, afterAll, it, expect } from "@jest/globals";
import { testWaitTime, catchConsoleError } from "./puppeteerUtil";

jest.setTimeout(30000);
let browser;
let page;
function pause(seconds) {
  return new Promise((res) => setTimeout(res, 1000 * seconds));
}

describe("Nounsmap-actual-twitter-user", () => {
  beforeAll(async () => {
    //browser = await dappeteer.launch(puppeteer, { metamaskVersion: 'v10.15.0', defaultViewport: null });
    browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();
    catchConsoleError(page);
    page.setDefaultTimeout(testWaitTime);
  });
  afterAll(async () => {
    browser.close();
  });

  it("login", async () => {
    await page.goto("http://localhost:8080/user");
    await page.waitForXPath('//button[@id="SignInTwitter"]');
    const _sign = await page.$x('//button[@id="SignInTwitter"]');
    await _sign[0].click();

    const newPagePromise = new Promise((x) =>
      browser.once("targetcreated", (target) => x(target.page()))
    );
    await newPagePromise;
    //following pause is important to wait twitter login page loaded
    await pause(3);

    //twitter popupウィンドウを取得する
    var pages = await browser.pages();
    //console.log("browser pages",pages);
    var popupwin = pages[pages.length - 1];
    await popupwin.waitForXPath('//input[@id="username_or_email"]');

    //console.log("pop",popupwin);
    await popupwin.type("#username_or_email", "");
    await popupwin.type("#password", "");
    const _allow = await popupwin.$x('//input[@id="allow"]');
    await _allow[0].click();
    await popupwin.waitForNavigation();
    //console.log("closed popup");
    await page.waitForXPath('//button[@id="SignOutTwitter"]');
    const _close = await page.$x('//button[@id="Close"]');
    await _close[0].click();
  });
});
