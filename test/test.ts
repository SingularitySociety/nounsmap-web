import puppeteer from "puppeteer";
import { jest, describe, beforeAll, afterAll, beforeEach, afterEach, it, expect } from "@jest/globals";
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
let photoId1,photoId2;
function pause(seconds) {
  return new Promise((res) => setTimeout(res, 1000 * seconds));
}
describe("Nounsmap-emulator-user", () => {
  beforeAll(async () => {
    //browser = await dappeteer.launch(puppeteer, { metamaskVersion: 'v10.15.0', defaultViewport: null });
    browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();
  });
  const pageErrors = [];
  beforeEach(()=>{
    page.on('pageerror', (e) => {
      pageErrors.push(e);
    });
  });
  afterEach(()=>{
    for (const e of pageErrors) {
      console.error("pageErrors happen",e);
      throw e;
    }  
  });

  it("login-emulator", async () => {
    await page.goto("http://localhost:8080/user");
    await page.waitForXPath('//button[@id="SignInTwitter"]');
    const _sign = await page.$x('//button[@id="SignInTwitter"]');
    await _sign[0].click();

    const newPagePromise = new Promise(x => browser.once('targetcreated', target => x(target.page()))); 
    await newPagePromise;
    //following pause is important to wait twitter login page loaded
    await pause(3);

    //popupウィンドウを取得する
    var pages = await browser.pages();
    var popupwin = pages[pages.length - 1];    
    await popupwin.waitForXPath('//li[@id="add-account-button"]/button[1]');
    const _add = await popupwin.$x('//li[@id="add-account-button"]/button[1]');
    await _add[0].click();

    //console.log("pop",popupwin);
    await popupwin.waitForXPath('//input[@id="email-input"]');
    //console.log("found email input");
    await popupwin.type("#email-input", "test@test.com");
    const _allow = await popupwin.$x('//button[@id="sign-in"]');
    await _allow[0].click();
    //console.log("closed popup");
    await page.waitForXPath('//button[@id="SignOutTwitter"]');
    const _close = await page.$x('//button[@id="Close"]');
    await _close[0].click();
  });

  it('upload photo"', async () => {
    await pause(2);
    await page.waitForXPath('//a[@id="UploadMenu"]');
    const _guide = await page.$x('//button[@id="GuidePhoto"]');
    const _uploadM = _guide.length ? _guide :  await page.$x('//a[@id="UploadMenu"]');
    //console.log("_uploadM", _uploadM);    
    const [fileChooser] = await Promise.all([
      page.waitForFileChooser(),
      _uploadM[0].click(),
    ]);
    //console.log("clicked upload", fileChooser);    
    await fileChooser.accept(["./test/resource/test1.jpg"]);
    await page.waitForXPath('//button[@id="UploadImage"]');
    await page.type("#photo_title", "testTitle1");
    await page.select("#postEvent", "1");
    const _upload = await page.$x('//button[@id="UploadImage"]');
    _upload[0].click();
    await page.waitForXPath('//div[@id="photoView"]');
    const urls = page.url().split("/");
    photoId1 = urls.slice(-1)[0];
    console.log(urls, photoId1);
    expect(page.url()).toEqual(expect.stringContaining("/p/"));
  });
  it('self upload photo can edit and edit cancel"', async () => {  

    await page.goto(`http://localhost:8080/p/${photoId1}`);
    await page.waitForXPath('//div[@id="photoView"]');
    const _titleView = await page.$x('//span[@id="PhotoTitleView"]');
    const _title1 = await (await _titleView[0].getProperty("textContent")).jsonValue();
    expect(_title1).toMatch('testTitle1');
    const _close = await page.$x('//div[@id="ClosePhotoView"]');
    await _close[0].click();
    const _view = await page.$x('//div[@id="photoView"]');
    expect(_view.length).toBe(0);

  });
  it('self upload photo can edit"', async () => {  
    await page.goto(`http://localhost:8080/p/${photoId1}`);
    await page.waitForXPath('//div[@id="photoView"]');
    const _titleView = await page.$x('//span[@id="PhotoTitleView"]');
    const _title1 = await (await _titleView[0].getProperty("textContent")).jsonValue();
    expect(_title1).toMatch('testTitle1');
    const _edit = await page.$x('//div[@id="EditInfo"]');
    expect(_edit[0]).not.toBeFalsy();
    _edit[0].click();
    await page.waitForXPath('//input[@id="PhotoTitleEdit"]');
    await page.type("#PhotoTitleEdit", "testTitle2");
    await page.select("#postEvent", "2");
    const _save = await page.$x('//div[@id="PhotoInfoSave"]');
    _save[0].click();
    await pause(10);
    await page.goto(`http://localhost:8080/p/${photoId1}`);
    await page.waitForXPath('//div[@id="photoView"]');
    const _titleView2 = await page.$x('//span[@id="PhotoTitleView"]');
    const _title2 = await (await _titleView2[0].getProperty("textContent")).jsonValue();
    expect(_title2).toMatch('testTitle2');
  });
  it('self upload photo can delete"', async () => {  
    await page.goto(`http://localhost:8080/p/${photoId1}`);
    await page.waitForXPath('//div[@id="photoView"]');
    const _titleView = await page.$x('//span[@id="PhotoTitleView"]');
    const _title1 = await (await _titleView[0].getProperty("textContent")).jsonValue();
    expect(_title1).toMatch('testTitle1');
    const _edit = await page.$x('//div[@id="EditInfo"]');
    expect(_edit[0]).not.toBeFalsy();
    _edit[0].click();
  });
  afterAll(async () => {
    browser.close();
  });
});  
describe("Nounsmap-twitter-user", () => {
  beforeAll(async () => {
    //browser = await dappeteer.launch(puppeteer, { metamaskVersion: 'v10.15.0', defaultViewport: null });
    browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();
  });

  it("login", async () => {
    await page.goto("http://localhost:8080/user");
    await page.waitForXPath('//button[@id="SignInTwitter"]');
    const _sign = await page.$x('//button[@id="SignInTwitter"]');
    await _sign[0].click();

    const newPagePromise = new Promise(x => browser.once('targetcreated', target => x(target.page()))); 
    await newPagePromise;
    //following pause is important to wait twitter login page loaded
    await pause(3);

    //twitter popupウィンドウを取得する
    var pages = await browser.pages();
    //console.log("browser pages",pages);
    var popupwin = pages[pages.length - 1];    
    await popupwin.waitForXPath('//input[@id="username_or_email"]');

    //console.log("pop",popupwin);
    await popupwin.type("#username_or_email", "test_nounsmap");
    await popupwin.type("#password", "hogehogehoge1234");
    const _allow = await popupwin.$x('//input[@id="allow"]');
    await _allow[0].click();
    await popupwin.waitForNavigation();
    //console.log("closed popup");
    await page.waitForXPath('//button[@id="SignOutTwitter"]');
    const _close = await page.$x('//button[@id="Close"]');
    await _close[0].click();
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
    await page.goto(`http://localhost:8080/p/${photoId2}`);
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