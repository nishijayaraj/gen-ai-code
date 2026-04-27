import { Component, OnInit } from '@angular/core';
import { UserService } from './user-service.service';
import { User } from './user.model';

@Component({
  selector: 'app-root',
  template: `
    <h2>Users</h2>
    <ul>
      <li *ngFor="let user of users">
        {{ user.name }} - {{ user.age }} - {{ user.emailAddress }}
      </li>
    </ul>
  `,
})
export class AppComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
    });
  }
}
