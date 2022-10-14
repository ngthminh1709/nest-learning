import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const authorizationHeader = request?.headers['authorization'];
    const token = authorizationHeader?.split(' ')[1];

    if (token) {
      try {
        this.jwtService.verify(token, {
          secret: process.env.ACESS_TOKEN_SECRET,
        });

        return true;
      } catch (e) {
        return false;
      }
    }

    throw new UnauthorizedException('Token is not valid!');
  }
}
