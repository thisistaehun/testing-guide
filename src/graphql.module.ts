import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import path from 'path';

@Module({})
export class GraphQLWithUploadModule {
  static forRoot(): DynamicModule {
    return {
      module: GraphQLWithUploadModule,
      imports: [
        GraphQLModule.forRootAsync<ApolloDriverConfig>({
          inject: [ConfigService],
          driver: ApolloDriver,
          useFactory: async (configService: ConfigService) => ({
            autoSchemaFile: path.join(process.cwd(), 'src/graphql/schema.gql'),
            driver: ApolloDriver,
            playground: false,
            plugins:
              configService.get('NODE_ENV') === 'dev'
                ? [ApolloServerPluginLandingPageLocalDefault({ embed: true })]
                : undefined,
            context: ({ req, res, connection }) => {
              if (req) {
                const user = req.headers.authorization;
                return { ...req, ...res, user };
              } else {
                return connection;
              }
            },
            cors: {
              credentials: true,
              origin: [
                'http://localhost:3000',
                'https://studio.apollographql.com',
              ],
              methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
              allowedHeaders: ['Content-Type', 'Authorization'],
            },
          }),
        }),
      ],
    };
  }
}
