import puppeteer from "puppeteer";
import { jest, describe, beforeAll, afterAll, it, expect } from "@jest/globals";
import { testWaitTime, catchConsoleError } from "./puppeteerUtil";

let browser;
let page;
let photoId1, photoId2;
function pause(seconds) {
  return new Promise((res) => setTimeout(res, 1000 * seconds));
}
describe("Nounsmap-emulator-user", () => {
  beforeAll(async () => {
    //browser = await dappeteer.launch(puppeteer, { metamaskVersion: 'v10.15.0', defaultViewport: null });
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
    catchConsoleError(page);
    page.setDefaultTimeout(testWaitTime);
  });
  afterAll(async () => {
    browser.close();
  });

  it("login-emulator", async () => {
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
    // to avoid following error on next test case, will wait 0.5 secs
    // @firebase/firestore: Firestore (9.9.1): Could not reach Cloud Firestore backend.
    await pause(0.5);
  });

  it('upload photo"', async () => {
    await page.goto("http://localhost:8080/map");
    await page.waitForXPath('//a[@id="UploadMenu"]');
    const _guide = await page.$x('//button[@id="GuidePhoto"]');
    const _uploadM = _guide.length
      ? _guide
      : await page.$x('//a[@id="UploadMenu"]');
    //console.log("_uploadM", _uploadM);
    const [fileChooser] = await Promise.all([
      page.waitForFileChooser(),
      _uploadM[0].click(),
    ]);
    //console.log("clicked upload", fileChooser);
    await fileChooser.accept(["./test/resource/test1.jpg"]);
    await page.waitForXPath('//input[@id="photo_title"]');
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
    const _title1 = await (
      await _titleView[0].getProperty("textContent")
    ).jsonValue();
    expect(_title1).toMatch("testTitle1");
    const _close = await page.$x('//div[@id="ClosePhotoView"]');
    await _close[0].click();
    const _view = await page.$x('//div[@id="photoView"]');
    expect(_view.length).toBe(0);
  });
  it('self upload photo can edit"', async () => {
    await page.goto(`http://localhost:8080/p/${photoId1}`);
    await page.waitForXPath('//div[@id="photoView"]');
    const _titleView = await page.$x('//span[@id="PhotoTitleView"]');
    const _title1 = await (
      await _titleView[0].getProperty("textContent")
    ).jsonValue();
    expect(_title1).toMatch("testTitle1");
    const _edit = await page.$x('//div[@id="EditInfo"]');
    expect(_edit[0]).not.toBeFalsy();
    _edit[0].click();
    await page.waitForXPath('//input[@id="PhotoTitleEdit"]');
    await page.type("#PhotoTitleEdit", "testTitle2");
    await page.select("#postEvent", "2");
    const _save = await page.$x('//span[@id="PhotoInfoSave"]');
    _save[0].click();
    await page.waitForXPath('//span[@id="PhotoInfoSaveComplete"]');
    //await pause(0.5);
    await page.goto(`http://localhost:8080/p/${photoId1}`);
    await page.waitForXPath('//div[@id="photoView"]');
    const _titleView2 = await page.$x('//span[@id="PhotoTitleView"]');
    const _title2 = await (
      await _titleView2[0].getProperty("textContent")
    ).jsonValue();
    expect(_title2).toMatch("testTitle2");
  });

  it('self upload photo can delete(canel)"', async () => {
    await page.goto(`http://localhost:8080/p/${photoId1}`);
    await page.waitForXPath('//div[@id="photoView"]');
    const _titleView = await page.$x('//span[@id="PhotoTitleView"]');
    const _title1 = await (
      await _titleView[0].getProperty("textContent")
    ).jsonValue();
    expect(_title1).toMatch("testTitle2");
    const _edit = await page.$x('//div[@id="DelPhoto"]');
    expect(_edit[0]).not.toBeFalsy();
    _edit[0].click();
    //confirm dialogが出ることの確認
    await page.waitForXPath('//div[@id="delPhotoConfirm"]');
    //cancelできる
    const _cancel = await page.$x('//button[@id="DelPhotoCancel"]');
    expect(_cancel[0]).not.toBeFalsy();
    _cancel[0].click();
    //avoid puppeter issue, wait little;
    await pause(0.5);
  });

  it('self upload photo can delete(do)"', async () => {
    await page.goto(`http://localhost:8080/p/${photoId1}`);
    await page.waitForXPath('//div[@id="photoView"]');
    const _edit = await page.$x('//div[@id="DelPhoto"]');
    expect(_edit[0]).not.toBeFalsy();
    _edit[0].click();
    //confirm dialog show
    await page.waitForXPath('//div[@id="delPhotoConfirm"]');
    //delete do
    const _do = await page.$x('//button[@id="DelPhotoDo"]');
    expect(_do[0]).not.toBeFalsy();
    _do[0].click();
    await page.waitForXPath('//span[@id="DelPhotoComplete"]');
    const _close = await page.$x('//button[@id="DelPhotoClose"]');
    expect(_close[0]).not.toBeFalsy();
    _close[0].click();
    await pause(0.5);
    expect(page.url()).toMatch("http://localhost:8080/map");
    //削除済みなのでURL指定してもphotoviewは開かない
    await page.goto(`http://localhost:8080/p/${photoId1}`);
    await pause(0.5);
    const _view = await page.$x('//div[@id="photoView"]');
    expect(_view[0]).toBeFalsy();
  });
  it("upload photo again", async () => {
    await page.goto(`http://localhost:8080/`);
    await pause(0.5);
    await page.waitForXPath('//a[@id="UploadMenu"]');
    const _guide = await page.$x('//button[@id="GuidePhoto"]');
    const _uploadM = _guide.length
      ? _guide
      : await page.$x('//a[@id="UploadMenu"]');
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
    photoId2 = urls.slice(-1)[0];
    console.log(urls, photoId2);
    expect(page.url()).toEqual(expect.stringContaining("/p/"));
  });
});

describe("Nounsmap-no-log-in", () => {
  beforeAll(async () => {
    //browser = await dappeteer.launch(puppeteer, { metamaskVersion: 'v10.15.0', defaultViewport: null });
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
    catchConsoleError(page);
  });
  afterAll(async () => {
    browser.close();
  });
  it('should be titled "nounsmap"', async () => {
    await page.goto("http://localhost:8080");
    await expect(page.title()).resolves.toMatch("nounsmap");
  });

  it('should be show log-in guide"', async () => {
    await page.waitForXPath('//button[@id="tryNow"]');
    const _start = await page.$x('//button[@id="tryNow"]');
    await _start[0].click();
    await pause(0.5);
    expect(page.url()).toEqual(expect.stringContaining("/user"));
  });

  it('can go to photo view before log-in"', async () => {
    await page.goto(`http://localhost:8080/p/${photoId2}`);
    await page.waitForXPath('//div[@id="photoView"]');
    const _close = await page.$x('//div[@id="ClosePhotoView"]');
  });
  it('After close photo view, should show log-in guide"', async () => {
    await page.goto(`http://localhost:8080/p/${photoId2}`);
    await page.waitForXPath('//div[@id="photoView"]');
    const _close = await page.$x('//div[@id="ClosePhotoView"]');
    await _close[0].click();
    await page.waitForXPath('//div[@id="CloseGuideLogin"]');
    const _closeGuide = await page.$x('//div[@id="CloseGuideLogin"]');
    await _closeGuide[0].click();
    await pause(0.5);
  });

  it('can select event "', async () => {
    await page.goto("http://localhost:8080");
    await page.waitForXPath('//select[@id="viewEventSelect"]');
    await page.select("#viewEventSelect", "1");
    await pause(0.5);
    expect(page.url()).toEqual(expect.stringContaining("/map/1"));
    await page.select("#viewEventSelect", "2");
    await pause(0.5);
    expect(page.url()).toEqual(expect.stringContaining("/map/2"));
    await page.select("#viewEventSelect", "0");
    await pause(0.5);
    expect(page.url()).toMatch("http://localhost:8080/map");
  });
  it('can direct link to event "', async () => {
    await page.goto("http://localhost:8080/map/1");
    await page.waitForXPath('//select[@id="viewEventSelect"]');
    let _event = await page.$x('//select[@id="viewEventSelect"]');
    let id = await (await _event[0].getProperty("value")).jsonValue();
    console.log(id);
    expect(parseInt(id)).toEqual(1);
    await page.goto("http://localhost:8080/map/2");
    await page.waitForXPath('//select[@id="viewEventSelect"]');
    _event = await page.$x('//select[@id="viewEventSelect"]');
    id = await (await _event[0].getProperty("value")).jsonValue();
    console.log(id);
    expect(parseInt(id)).toEqual(2);
    await page.goto("http://localhost:8080/map");
    await page.waitForXPath('//select[@id="viewEventSelect"]');
    _event = await page.$x('//select[@id="viewEventSelect"]');
    id = await (await _event[0].getProperty("value")).jsonValue();
    console.log(id);
    expect(parseInt(id)).toEqual(0);
  });
});
