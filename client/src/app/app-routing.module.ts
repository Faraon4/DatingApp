import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { TestErrorsComponent } from './errors/test-errors/test-errors.component';
import { HomeComponent } from './home/home.component';
import { ListsComponent } from './lists/lists.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { AuthGuard } from './_guards/auth.guard';

const routes: Routes = [
  {path: '', component: HomeComponent}, // Here the path is emprty because we want to show the HomeComponent
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      {path: 'members', component: MemberListComponent, canActivate: [AuthGuard]}, // We add a route for our members
  {path: 'members/:username', component: MemberDetailComponent}, // we add route for the details of the our members , and for going to details page we will write the id of person
  {path: 'member/edit', component:MemberEditComponent},
  {path: 'lists', component: ListsComponent},
  {path: 'messages', component: MessagesComponent}
    ]
  },
  // Route for the errors
  {path: 'errors', component: TestErrorsComponent},
  {path: 'not-found', component:NotFoundComponent},
  {path: 'server-error', component: ServerErrorComponent},
  {path: '**', component: NotFoundComponent, pathMatch: 'full'}, // we write this if the user is entering something that not exits, this is also called wild route
                                                             // pathMatch: 'full', the URL should be all correct, not only a part of it 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
