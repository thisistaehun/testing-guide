import { registerAs } from '@nestjs/config';

export const baseConfig = registerAs('base', () => ({
  host: process.env.HOST,
}));
