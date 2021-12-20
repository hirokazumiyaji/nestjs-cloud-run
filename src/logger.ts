import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { stdTimeFunctions } from 'pino';
import { Constants } from '@google-cloud/trace-agent/build/src/constants';
import { parseContextFromHeader } from '@google-cloud/trace-agent/build/src/util';

const severities = {
  10: 'DEFAULT',
  20: 'DEBUG',
  30: 'INFO',
  40: 'WARN',
  50: 'ERROR',
  60: 'CRITICAL',
} as const;

export const LoggerModule = PinoLoggerModule.forRoot({
  pinoHttp: {
    useLevel: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
    timestamp: stdTimeFunctions.isoTime,
    formatters: {
      level: (label: string, number: number) => ({
        severity: severities[number],
      }),
    },
    messageKey: 'message',
    reqCustomProps: (req) => {
      const traceHeader = req.headers[Constants.TRACE_CONTEXT_HEADER_NAME] as string;
      if (!traceHeader) {
        return {};
      }
      const traceContext = parseContextFromHeader(traceHeader);
      if (!traceContext) {
        return {};
      }
      if (!traceContext.traceId) {
        return {};
      }
      return {
        'logging.googleapis.com/trace': `projects/${process.env.GCP_PROJECT}/traces/${traceContext.traceId}`,
      };
    },
  },
});
