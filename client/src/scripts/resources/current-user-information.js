import request from 'axios';

import ajaxErrorHandler from '../utils/ajax-error-handler';


export class CurrentUserInformationResource {
  fetch() {
    return new Promise((resolve) => {
      request.get('/api/v1/current_user_information').then((res) => {
        resolve(res);
      }).catch(ajaxErrorHandler);
    });
  }
}
export default new CurrentUserInformationResource();
