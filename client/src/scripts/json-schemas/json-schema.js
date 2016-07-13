import tv4 from 'tv4';
import logger from '../utils/logger';

export function validateByJSONSchema(data, schema) {
  const result = tv4.validateMultiple(data, schema);

  if (result.errors.length) {
    logger.error(result);
  }

  return result;
}
