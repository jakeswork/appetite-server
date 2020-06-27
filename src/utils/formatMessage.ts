import { FormattedMessage } from '../types/constants';

export default (username: string, message: string): FormattedMessage => ({
  username,
  message,
  time: new Date().toISOString()
})
