import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RawHeaders = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    if (data && req.rawHeaders.length % 2 === 0) {
      const headers: { [key: string]: string } = {};

      for (let i = 0; i < req.rawHeaders.length; i += 2) {
        const key = req.rawHeaders[i];
        const value = req.rawHeaders[i + 1];
        if (key && value) {
          headers[key] = value;
        }
      }
      return headers[data];
    }

    return req.rawHeaders;
  },
);
