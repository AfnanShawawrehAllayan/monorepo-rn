/* global describe, it, beforeAll, beforeEach */
import { device, element, by, expect } from 'detox';

describe('Chat App', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.launchApp({ newInstance: true });
  });

  it('should show chat list on launch', async () => {
    await new Promise(res => setTimeout(res, 1500));
    try {
      await expect(element(by.id('chatList'))).toBeVisible();
    } catch (e) {
      await device.takeScreenshot('debug-chatList');
      throw e;
    }
  });

  it('should open chat room when tapping on a chat', async () => {
    await element(by.id('chatItem-0')).tap();
    await expect(element(by.id('chatRoom'))).toBeVisible();
  });

  it('should send a message in chat room', async () => {
    // First navigate to chat room
    await element(by.id('chatItem-0')).tap();
    await expect(element(by.id('chatRoom'))).toBeVisible();

    // Wait for the screen to be fully loaded
    await new Promise(res => setTimeout(res, 1000));

    // Then send the message
    const testMessage = 'Hello from E2E test';
    await element(by.id('messageInput')).tap();
    await element(by.id('messageInput')).typeText(testMessage);

    // Wait for keyboard to appear and view to be laid out
    await new Promise(res => setTimeout(res, 500));

    await element(by.id('sendButton')).tap();
    await expect(element(by.text(testMessage))).toBeVisible();
  });
});
