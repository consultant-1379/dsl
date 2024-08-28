import homePo from '../pages/home.po';
import projectsPo from '../pages/projects.po';
import { browser } from 'protractor';

describe('HomePage', () => {

  beforeEach(async () => {
    await homePo.goto();
  });

  it('should navigate to the projects page when projects is clicked', async () => {
    await homePo.projectsPageLinkClick();
    expect(projectsPo.getTitleText()).toBe('PROJECTS');
  });
});
