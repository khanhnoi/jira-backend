import { Injectable, Logger } from '@nestjs/common';
import { GqlOptionsFactory, GqlModuleOptions } from '@nestjs/graphql';

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
  createGqlOptions(): GqlModuleOptions {
    return {
      typePaths: ['./**/*.graphql', './root.graphql'],
      installSubscriptionHandlers: true,
      playground: true,
      context: ({ req, connection }) => {
        if (connection) {
          return connection.context;
        }
        return { req };
      },
    };
  }
}
