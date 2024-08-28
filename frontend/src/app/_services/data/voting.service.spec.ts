import { TestBed } from '@angular/core/testing';

import { VotingService } from './voting.service';
import { ProjectService } from './project.service';
import { LocalStorageService } from '../local-storage.service';
import { ConfigService } from '../config.service';
import { UserVotes } from 'src/app/_models/userVotes';
import { Vote } from 'src/app/_models/vote';

describe(('VotingService'), () => {

  describe('userHasAlreadyVotedForProject', () => {

    let votingService: VotingService;
    const configService = jasmine.createSpyObj('ConfigService', ['getDatabaseApi']);
    configService.getDatabaseApi.and.returnValue('');
    const userVotes = getSampleUserVotes();

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          VotingService,
          { provide: ProjectService, useValue: {} },
          { provide: LocalStorageService, useValue: {} },
          { provide: ConfigService, useValue: configService },
        ],
      });
      votingService = TestBed.get(VotingService);
    });

    it(('should return true if the user has voted for the project'), () => {
      const projectId = 'project2';
      const result = votingService.userHasAlreadyVotedForProject(projectId, userVotes);
      expect(result).toBe(true);
    });

    it(('should return false if the user has not voted for the project'), () => {
      const projectId = 'nonExistingProject';
      const result = votingService.userHasAlreadyVotedForProject(projectId, userVotes);
      expect(result).toBe(false);
    });
  });
});

function getSampleUserVotes() {
  const userVotes = new UserVotes();
  const vote1 = new Vote('project1');
  const vote2 = new Vote('project2');
  const vote3 = new Vote('project3');
  const vote4 = new Vote('project4');
  const votes = [vote1, vote2, vote3, vote4];
  userVotes.votes = votes;
  return userVotes;
}
