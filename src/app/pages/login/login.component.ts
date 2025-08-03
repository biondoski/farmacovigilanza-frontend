import { Component, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const { clientX, clientY } = event;
    const { offsetWidth, offsetHeight } = this.el.nativeElement;

    const moveX = (clientX - offsetWidth / 2) / (offsetWidth / 2) * -5;
    const moveY = (clientY - offsetHeight / 2) / (offsetHeight / 2) * -5;

    this.renderer.setStyle(this.el.nativeElement, '--move-x', `${moveX}px`);
    this.renderer.setStyle(this.el.nativeElement, '--move-y', `${moveY}px`);
  }

  onSubmit(): void {
    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage = 'Credenziali non valide. Riprova.';
        console.error(err);
      }
    });
  }
}
