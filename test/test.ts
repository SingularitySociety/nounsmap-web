import puppeteer from "puppeteer";
import { jest, describe, beforeAll, afterAll, it, expect } from "@jest/globals";
import { RECOMMENDED_METAMASK_VERSION } from "@chainsafe/dappeteer";
import * as dappeteer from "@chainsafe/dappeteer";

/*
dappeteer depends on LANG=en  (to wait some button, using englisht text matcher)
On mac OS,  you need to change system language setting to change locale to en.
*/
jest.setTimeout(30000);
let browser;
let metamask;
let page;
let photoId;
function pause(seconds) {
  return new Promise((res) => setTimeout(res, 1000 * seconds));
}

describe("Nounsmap-user", () => {
  beforeAll(async () => {
    //browser = await dappeteer.launch(puppeteer, { metamaskVersion: 'v10.15.0', defaultViewport: null });
    browser = await dappeteer.launch(puppeteer, {
      metamaskVersion:
        process.env.METAMASK_VERSION || RECOMMENDED_METAMASK_VERSION,
    });
    metamask = await dappeteer.setupMetamask(browser,{});
    page = await browser.newPage();
    await page.goto("http://localhost:8080");
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
    await page.waitForXPath('//button[@id="SignOut"]');
    const _close = await page.$x('//button[@id="Close"]');
    await _close[0].click();
  });

  it('login upload photo"', async () => {
    await pause(2);
    await page.waitForXPath('//a[@id="UploadMenu"]');
    console.log("uploadPhoto start");    
    const _guide = await page.$x('//button[@id="GuidePhoto"]');
    const _uploadM = _guide.length ? _guide :  await page.$x('//a[@id="UploadMenu"]');
    console.log("_uploadM", _uploadM);    
    const [fileChooser] = await Promise.all([
      page.waitForFileChooser(),
      _uploadM[0].click(),
    ]);
    console.log("clicked upload", fileChooser);    
    await fileChooser.accept(["./test/resource/test1.jpg"]);
    await page.waitForXPath('//button[@id="UploadImage"]');
    await page.type("#photo_title", "testTitle");
    const _upload = await page.$x('//button[@id="UploadImage"]');
    _upload[0].click();
    await page.waitForXPath('//div[@id="photoView"]');
    const urls = page.url().split("/");
    photoId = urls.slice(-1)[0];
    console.log(urls, photoId);
    expect(page.url()).toEqual(expect.stringContaining("/p/"));
  });

  it('should be change to my-photo view after log-in"', async () => {
    await page.goto(`http://localhost:8080/p/${photoId}`);
    await page.waitForXPath('//div[@id="photoView"]');
  });

  afterAll(async () => {
    browser.close();
  });
});


describe("Nounsmap-no-log-in", () => {
  beforeAll(async () => {
    //browser = await dappeteer.launch(puppeteer, { metamaskVersion: 'v10.15.0', defaultViewport: null });
    browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();
  });
  it('should be titled "nounsmap"', async () => {
    await page.goto("http://localhost:8080");
    await expect(page.title()).resolves.toMatch("nounsmap");
  });

  it('should be show log-in guide"', async () => {
    await page.waitForXPath('//button[@id="tryNow"]');
    const _start = await page.$x('//button[@id="tryNow"]');
    await _start[0].click();
    await pause(2);
    expect(page.url()).toEqual(expect.stringContaining("/user"));
  });

  it('can go to photo view before log-in"', async () => {
    await page.goto(`http://localhost:8080/p/${photoId}`);
    await page.waitForXPath('//div[@id="photoView"]');
  });
  it('After close photo view, should show log-in guide"', async () => {
    const _close = await page.$x('//div[@id="ClosePhotoView"]');
    await _close[0].click();
    await page.waitForXPath('//div[@id="CloseGuideLogin"]');
    const _closeGuide = await page.$x('//div[@id="CloseGuideLogin"]');
    await _closeGuide[0].click();
    await pause(1);
  });

  it('can select event "', async () => {
    await page.waitForXPath('//select[@id="viewEventSelect"]');
    await page.select("#viewEventSelect", "1");
    await pause(1);
    expect(page.url()).toEqual(expect.stringContaining("/map/1"));
    await page.select("#viewEventSelect", "2");
    await pause(1);
    expect(page.url()).toEqual(expect.stringContaining("/map/2"));
    await page.select("#viewEventSelect", "0");
    await pause(1);
    expect(page.url()).toMatch("http://localhost:8080/map");
  });

  afterAll(async () => {
    browser.close();
  });
});