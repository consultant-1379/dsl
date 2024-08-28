import { browser, by, element } from 'protractor';

export class BasePage {

  url = '';
  private projectsPageLink = element(by.linkText('projects'));

  async goto() {
    await browser.get(this.url);
  }

  async projectsPageLinkClick() {
    await this.projectsPageLink.click();
  }

}
