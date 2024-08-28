import { BasePage } from './base.po';

class HomePage extends BasePage {

  constructor() {
    super();
    this.url = 'home';
  }
}
export default new HomePage();
