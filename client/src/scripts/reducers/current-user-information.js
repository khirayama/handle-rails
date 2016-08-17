import { actionTypes as types } from '../constants/constants';


export default function currentUserInformation(state, action) {
  switch (action.type) {
    case types.GET_CURRENT_USER_INFORMATION:
      return action.currentUserInformation;
    case types.FAIL_AUTHENTICATE:
      return null;
  }
}
