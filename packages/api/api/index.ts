import type { IncomingMessage, ServerResponse } from 'http';
import { createApp } from '../src/app.js';

const { app } = createApp();
const ready = app.ready();

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  await ready;
  app.server.emit('request', req, res);
}
