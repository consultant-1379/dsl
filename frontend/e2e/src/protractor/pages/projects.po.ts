import { browser, by, element } from 'protractor';

import { BasePage } from './base.po';

class ProjectsPage extends BasePage {
  constructor() {
    super();
    this.url = 'projects';
  }

  getTitleText() {
    return element(by.css('.title')).getText();
  }
}
export default new ProjectsPage();
