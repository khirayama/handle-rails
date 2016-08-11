import { dispatch } from '../../../libs/app-dispatcher';


export default function transitionEventHandler(event) {
  event.preventDefault();

  const pathname = event.currentTarget.getAttribute('href');
  history.pushState(null, null, pathname);
  dispatch({
    type: 'UI_CHANGE_HISTORY',
    pathname: pathname,
  });
}
