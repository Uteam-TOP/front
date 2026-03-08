import {Component, ViewEncapsulation} from '@angular/core';
import { AuthService } from '../personal-account/auth-service.service';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { TokenService } from '../token.service';
import {
  SkeletonProfileComponent
} from "../../shared/ui-components/skeleton-ui/skeleton-profile/skeleton-profile.component";

@Component({
  selector: 'app-user-path',
  standalone: true,
  imports: [RouterOutlet, SkeletonProfileComponent],
  templateUrl: './user-path.component.html',
  styleUrl: './user-path.component.css',
  encapsulation: ViewEncapsulation.None
})
export class UserPathComponent {

  userNick!: string;
  userCurrentNick!: string;
  isCurrentUser: boolean = false;
  paramsSubscription!: Subscription;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private tokenService:TokenService
  ) { }

  reloadComponent(): void {
    this.paramsSubscription = this.route.params.subscribe(params => {
      this.userNick = params['id'];
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        this.isLoading = false;
        this.router.navigateByUrl(`/${this.userNick}/profile`);
        return;
      }

      const storedNickname = localStorage.getItem('userNickname');

      if (this.userNick === storedNickname) {
        this.authService.getCurrentUser().subscribe(
          (user: any) => {
            this.isLoading = false;
            const token = localStorage.getItem('authToken');
            const nick = localStorage.getItem('userNickname');

            if (token && nick) {
              if (!this.router.url.startsWith(`/${this.userNick}/account`)) {
                this.router.navigateByUrl(`/${this.userNick}/account`);
              }
            } else {
              if (!this.router.url.startsWith(`/${this.userNick}/profile`)) {
                this.router.navigateByUrl(`/${this.userNick}/profile`);
              }
            }
          },
          (error) => {
            this.tokenService.clearToken();
            localStorage.removeItem('Linkken');
            localStorage.removeItem('fullAccess');
            localStorage.removeItem('userNickname');
            this.router.navigate(['/']);
          }
        );
      } else {
        this.isLoading = false;
        this.router.navigateByUrl(`/${this.userNick}/profile`);
      }
    });
  }

  ngOnInit(): void {
    // Подписка на параметры маршрута
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Проверяем, находится ли пользователь на той же странице
        if (this.router.url === `/${localStorage.getItem('userNickname')}`) {
          this.reloadComponent();
        }
      }
    });

    this.reloadComponent();
  }



  ngOnDestroy(): void {
    // Отписка от подписки на изменение маршрута при уничтожении компонента
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
  }
}
