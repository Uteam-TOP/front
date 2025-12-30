import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'avatar',
  standalone: true
})
export class AvatarPipe implements PipeTransform {

  transform(avatarUrl: string): string {
    if (avatarUrl.includes('/')) {
      return avatarUrl;
    } else {
      return 'assets/avatars/' + avatarUrl + '.png' ;
    }
  }

}
