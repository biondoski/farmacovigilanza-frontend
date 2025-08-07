import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  user: User | null = null;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  get canViewAnalytics(): boolean {
    if (!this.user) return false;
    return this.user.role === 'Analista' || this.user.role === 'Admin';
  }

  get isAdmin(): boolean {
    return this.user?.role === 'Admin';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
