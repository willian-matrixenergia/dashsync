import type { IncomingMessage, ServerResponse } from 'node:http';
import { createApp } from '../src/app.js';

const { handler } = createApp();

export default function handle(req: IncomingMessage, res: ServerResponse): void {
  handler(req, res);
}
