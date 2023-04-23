import { LogLevel } from 'typescript-logging';
import { Log4TSProvider } from 'typescript-logging-log4ts-style';

export const log4TSProvider = Log4TSProvider.createProvider('Log4Provider', {
  level: LogLevel.Debug,
  groups: [
    {
      expression: new RegExp('.+')
    }
  ]
});
