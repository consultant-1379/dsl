import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProjectsComponent } from './projects/projects.component';
import { AuthGuard } from './_guards/auth.guard';
import { CanDeactivateGuard } from './_guards/can-deactivate.guard';
import { ProjectDetailsComponent } from './projects/project-details/project-details.component';
import { AllProjectsComponent } from './projects/all-projects/all-projects.component';

const appRoutes = [
  // basic routes
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'workspace', component: ProjectsComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard],

  },
  { path: 'project-details/:id', component: ProjectDetailsComponent },
  { path: 'projects', component: AllProjectsComponent },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
