import { DslComment } from './dsl-comment';

interface IProject {
  _id: string;
  _rev: string;
  author: string;
  authorDisplayName: string;
  type: string;
  projectname: string;
  description: string;
  category: string;
  public: boolean;
  featured: boolean;
  votes: number;
  linkToFile: string;
  hashtags: string[];
  comments: DslComment[];
  created: Date;
}

export class Project implements IProject {

  _id = '';
  _rev = '';
  author = '';
  authorDisplayName = '';
  type = 'project';
  projectname = '';
  description = '';
  category = '';
  public = false;
  featured = false;
  votes = 0;
  linkToFile = '';
  hashtags: string[] = [];
  comments: DslComment[] = [];
  created: Date;

  constructor() { }
}
