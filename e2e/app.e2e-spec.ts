import { AbelhasWebPage } from './app.po';

describe('abelhas-web App', function() {
  let page: AbelhasWebPage;

  beforeEach(() => {
    page = new AbelhasWebPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
