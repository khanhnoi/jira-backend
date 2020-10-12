import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeormConfigService } from './shared/module/config/typeorm';
import { GqlConfigService } from './shared/module/config/graphql';
import { AuthModule } from './feature/auth/auth.module';
import { UsersResolver } from './feature/user/user.resolver';
import { UserModule } from './feature/user/user.module';
import { ConfigModule } from './shared/module/config/config.module';
import { JwtStrategy } from './feature/auth/strategy/jwt.strategy';
import { ProjectModule } from './feature/project/project.module';
import { IssueModule } from './feature/issue/issue.module';
import { EpicModule } from './feature/epic/epic.module';
import { DateScalar } from './shared/module/config/graphql/scalars/date.scalar';
import { SprintModule } from './feature/sprint/sprint.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeormConfigService,
    }),
    GraphQLModule.forRootAsync({
      useClass: GqlConfigService,
    }),
    AuthModule,
    UserModule,
    ProjectModule,
    IssueModule,
    EpicModule,
    SprintModule,
  ],
  providers: [UsersResolver, JwtStrategy, DateScalar],
})
export class AppModule {}
