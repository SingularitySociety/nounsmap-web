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
    await page.waitForXPath('//button[contains(text(),"Start")]');
    const _start = await page.$x('//button[contains(text(),"Start")]');
    await pause(2);
    await _start[0].click();
    await pause(2);
    expect(page.url()).toEqual(expect.stringContaining("/user"));
  });

  it('can go to photo view before log-in"', async () => {
    await page.goto("http://localhost:8080/p/ujnZObt4Cg942kz0AgYb");
    await expect(page.title()).resolves.toMatch("nounsmap");
  });

  it('should select event "', async () => {
    await page.goto("http://localhost:8080");
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

describe("Nounsmap-user", () => {
  beforeAll(async () => {
    //browser = await dappeteer.launch(puppeteer, { metamaskVersion: 'v10.15.0', defaultViewport: null });
    browser = await dappeteer.launch(puppeteer, {
      metamaskVersion:
        process.env.METAMASK_VERSION || RECOMMENDED_METAMASK_VERSION,
    });
    //const metamask = await dappeteer.setupMetamask(browser,{seed: "already blah birth blah since blah keep blah skirt blah any blah"});
    metamask = await dappeteer.setupMetamask(browser, {
      // optional, else it will use a default seed
      seed: "pioneer casual canoe gorilla embrace width fiction bounce spy exhibit another dog",
      password: "password1234",
    });
    page = await browser.newPage();
    await page.goto("http://localhost:8080");
  });

  it("login with metamask", async () => {
    await page.goto("http://localhost:8080/user");
    await page.waitForXPath('//button[contains(text(),"Connect")]');
    const _connect = await page.$x('//button[contains(text(),"Connect")]');
    await _connect[0].click();
    await pause(2);
    await metamask.approve({ allAccounts: false });
    page.bringToFront();
    await page.waitForXPath('//button[contains(text(),"Wallet")]');
    const _sign = await page.$x('//button[contains(text(),"Wallet")]');
    await _sign[0].click();
    await pause(5);
    await metamask.sign();
    page.bringToFront();
    await pause(4);
    await page.waitForXPath('//button[contains(text(),"SignOut")]');
    await page.waitForXPath('//button[contains(text(),"Close")]');
    const _close = await page.$x('//button[contains(text(),"Close")]');
    await _close[0].click();
  });

  it('login upload photo"', async () => {
    await pause(2);
    await page.waitForXPath('//a[contains(text(),"Upload")]');
    const _upload = await page.$x('//a[contains(text(),"Upload")]');
    const [fileChooser] = await Promise.all([
      page.waitForFileChooser(),
      _upload[0].click(),
    ]);
    //console.log("clicked upload", fileChooser);
    await fileChooser.accept(["./src/assets/sample/pexels-11518762.jpg"]);
    await page.waitForXPath('//button[contains(text(),"Upload Image")]');
    await page.type("#photo_title", "testTitle");
    const _uploadImage = await page.$x(
      '//button[contains(text(),"Upload Image")]'
    );
    _uploadImage[0].click();
    await page.waitForXPath('//div[@id="photoView"]');
    const urls = page.url().split("/");
    photoId = urls.slice(-1)[0];
    console.log(urls, photoId);
    expect(page.url()).toEqual(expect.stringContaining("/p/"));
  });

  it('should be change to my-photo view after log-in"', async () => {
    await page.goto("http://localhost:8080/p/WjmYq4Lo6CrZTKSj3TG2");
    await expect(page.title()).resolves.toMatch("nounsmap");
  });

  afterAll(async () => {
    browser.close();
  });
});
