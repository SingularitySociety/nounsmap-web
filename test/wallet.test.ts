import puppeteer from "puppeteer";
import { jest, describe, beforeAll, afterAll, it, expect } from "@jest/globals";
import { RECOMMENDED_METAMASK_VERSION } from "@chainsafe/dappeteer";
import * as dappeteer from "@chainsafe/dappeteer";
import { testWaitTime, catchConsoleError } from "./puppeteerUtil";
/*
dappeteer depends on LANG=en  (to wait some button, using englisht text matcher)
On mac OS,  you need to change system language setting to change locale to en.
*/
jest.setTimeout(30000);
let browser;
let metamask;
let page;
let photoId1, photoId2;
function pause(seconds) {
  return new Promise((res) => setTimeout(res, 1000 * seconds));
}

describe("Nounsmap-user-wallet", () => {
  beforeAll(async () => {
    //browser = await dappeteer.launch(puppeteer, { metamaskVersion: 'v10.15.0', defaultViewport: null });
    browser = await dappeteer.launch(puppeteer, {
      metamaskVersion:
        process.env.METAMASK_VERSION || RECOMMENDED_METAMASK_VERSION,
    });
    metamask = await dappeteer.setupMetamask(browser, {});
    page = await browser.newPage();
    catchConsoleError(page);
    page.setDefaultTimeout(testWaitTime);
    await page.goto("http://localhost:8080");
  });
  afterAll(async () => {
    browser.close();
  });

  it("login with metamask", async () => {
    await page.goto("http://localhost:8080/user");
    await page.waitForXPath('//button[@id="ConnectMetamask"]');
    const _connect = await page.$x('//button[@id="ConnectMetamask"]');
    await _connect[0].click();
    await pause(2);
    await metamask.approve({ allAccounts: false });
    page.bringToFront();
    await page.waitForXPath('//button[@id="SignInWallet"]');
    const _sign = await page.$x('//button[@id="SignInWallet"]');
    await _sign[0].click();
    await pause(5);
    await metamask.sign();
    page.bringToFront();
    await pause(4);
    await page.waitForXPath('//button[@id="SignOut"]');
    const _close = await page.$x('//button[@id="Close"]');
    await _close[0].click();
  });

  it('login upload photo"', async () => {
    await pause(2);
    await page.waitForXPath('//a[@id="UploadMenu"]');
    console.log("uploadPhoto start");
    const _guide = await page.$x('//button[@id="GuidePhoto"]');
    const _uploadM = _guide.length
      ? _guide
      : await page.$x('//a[@id="UploadMenu"]');
    console.log("_uploadM", _uploadM);
    const [fileChooser] = await Promise.all([
      page.waitForFileChooser(),
      _uploadM[0].click(),
    ]);
    console.log("clicked upload", fileChooser);
    await fileChooser.accept(["./test/resource/test2.jpg"]);
    await page.waitForXPath('//button[@id="UploadImage"]');
    await page.type("#photo_title", "testTitle");
    const _upload = await page.$x('//button[@id="UploadImage"]');
    _upload[0].click();
    await page.waitForXPath('//div[@id="photoView"]');
    const urls = page.url().split("/");
    photoId2 = urls.slice(-1)[0];
    console.log(urls, photoId2);
    expect(page.url()).toEqual(expect.stringContaining("/p/"));
  });

  it('should be change to my-photo view after log-in"', async () => {
    await page.goto(`http://localhost:8080/p/${photoId2}`);
    await page.waitForXPath('//div[@id="photoView"]');
  });
});
