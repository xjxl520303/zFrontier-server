import { Logger, LoggerService } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';
import clc from 'cli-color';
import safeStringify from 'fast-safe-stringify';
import { join } from 'path';
import { inspect } from 'util';
import DailyRotateFile from 'winston-daily-rotate-file';

const formatter = format.combine(
  format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss.SSS ZZ'
  }),
  format.ms(),
  format.printf((info) => {
    const { context, level, timestamp, message, ms, ...meta } = info;
    const nestLikeColorScheme: Record<string, clc.Format> = {
      info: clc.green,
      error: clc.red,
      warn: clc.yellow,
      debug: clc.magentaBright,
      verbose: clc.cyanBright,
    };
    const color = nestLikeColorScheme[level] || ((text: string): string => text);
    const stringifiedMeta = safeStringify(meta);
    const formattedMeta = inspect(JSON.parse(stringifiedMeta), {
      colors: true,
      depth: null
    })

    return (
      `${clc.yellow('[ZFrontier]')}` +
      color(`[${level.toUpperCase()}]`) +
      (timestamp ? clc.green(`[${timestamp}]`) : '') +
      (context ? `${clc.yellow('[' + context + ']')}` : '') +
      (`${color(message)}` + (ms || formattedMeta !== '{}' ? '-' : '')) +
      (`${formattedMeta !== '{}' ? formattedMeta : ''}`) +
      (ms ? `${clc.yellow(ms)}` : '')
    );
  })
)

const rotateTransport: DailyRotateFile = new DailyRotateFile({
  format: format.uncolorize(),
  filename: 'zfrontier-%DATE%.log',
  dirname: join(process.cwd(), './logs'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
})

export const WinstonLogger: LoggerService = WinstonModule.createLogger({
  exitOnError: false,
  format: formatter,
  transports: [
    new transports.Console(),
    rotateTransport
  ]
});

Logger.overrideLogger(WinstonLogger);
