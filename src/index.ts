import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fp, { nextCallback } from 'fastify-plugin';
import { default as twitchEbsTools } from 'fastify-twitch-ebs-tools';

import { default as statusRoutes } from './routes/status/index';
import { default as configRoutes } from './routes/config';
import { default as viewerRoutes } from './routes/viewer';
import cache from './plugins/cache';
import db from './plugins/db';
import playerConfig from './plugins/playerConfig';
import { IncomingMessage } from 'http';

interface ServerOptions {
  db: {
    uri: string;
  },
  twitch: {
    secret: string;
    enableOnauthorized: boolean;
  },
  maxPlayerProfileCount: number;
}

const api = fp(
  (fastify: FastifyInstance, opts: ServerOptions, next: Function) => {
    const { maxPlayerProfileCount } = opts;
    fastify.register(cache);
    fastify.register(db, {
      ...opts.db,
      maxPlayerProfileCount,
    });
    fastify.register(playerConfig, { maxPlayerProfileCount });
    fastify.register(statusRoutes);
    fastify.register(twitchEbsTools, {
      secret: opts.twitch.secret,
      disabled: !opts.twitch.enableOnauthorized,
    });

    fastify.decorate("authenticateConfig", (request: FastifyRequest, reply: FastifyReply<IncomingMessage>, done: nextCallback) => {
      try {
        const channelIdInUrl = request.params.channelId;
        const { channelid, token } = request.headers;

        const channelIdCorrect = channelIdInUrl === channelid;
        const payloadValid = fastify.twitchEbs.validatePermission(
          token,
          channelid,
          'broadcaster',
        );

        if (channelIdCorrect && payloadValid) {
          done();
        } else {
          reply.code(401).send({
            status: 401,
            message: 'Unauthorized',
          });
        }
      } catch (error) {
        reply.code(401).send({
          status: 401,
          message: 'Unauthorized',
        });
      }
    });

    fastify.register(configRoutes.get);
    fastify.register(configRoutes.post);
    fastify.register(viewerRoutes.get);
    next();
  },
);

export = api;
