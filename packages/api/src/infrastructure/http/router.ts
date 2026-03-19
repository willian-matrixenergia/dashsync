import type { IncomingMessage, ServerResponse } from 'node:http';

export type Params = Record<string, string>;
export type Handler = (
  req: IncomingMessage,
  res: ServerResponse,
  params: Params,
) => Promise<void>;

interface Route {
  method: string;
  regex: RegExp;
  paramNames: string[];
  handler: Handler;
}

export class Router {
  private routes: Route[] = [];

  get(path: string, handler: Handler): void {
    this.add('GET', path, handler);
  }

  post(path: string, handler: Handler): void {
    this.add('POST', path, handler);
  }

  private add(method: string, path: string, handler: Handler): void {
    const paramNames: string[] = [];
    const pattern = path.replace(/:([^/]+)/g, (_m, name: string) => {
      paramNames.push(name);
      return '([^/]+)';
    });
    this.routes.push({ method, regex: new RegExp(`^${pattern}$`), paramNames, handler });
  }

  match(
    method: string,
    pathname: string,
  ): { handler: Handler; params: Params } | null {
    for (const route of this.routes) {
      if (route.method !== method) continue;
      const m = route.regex.exec(pathname);
      if (!m) continue;
      const params: Params = {};
      route.paramNames.forEach((name, i) => {
        params[name] = m[i + 1] ?? '';
      });
      return { handler: route.handler, params };
    }
    return null;
  }
}
