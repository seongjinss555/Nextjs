import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
//PassportStrategy(Strategy) 상속
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    //생성자

    //부모 클래스의 생성자를 호출
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google',
      scope: ['email', 'profile'],
    });
  }

  //OAuth 인증이 끝나고 콜백으로 실행되는 메서드
  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { id, name, emails } = profile;
    console.log(accessToken);
    console.log(refreshToken);

    const providerId = id;
    const email = emails[0].value; //우리가 받을 수 있는 값은 이메일 한 개이므로 emails[0].value만 필요

    const user: User = await this.userService.findByEmailOrSave(
      email,
      name.familyName + name.givenName,
      providerId,
    ); // 유저 정보 저장 혹은 가져오기

    console.log(providerId, email, name.familyName, name.givenName);
    return user; // 유저 정보 반환
  }
}
