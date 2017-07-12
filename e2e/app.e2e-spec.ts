import { SkinnerPanelWebCliPage } from './app.po';

describe('skinner-panel-web-cli App', () => {
  let page: SkinnerPanelWebCliPage;

  beforeEach(() => {
    page = new SkinnerPanelWebCliPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
