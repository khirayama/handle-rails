export function isMobileUI() {
  const ua = window.navigator.userAgent;

  let isTouchable = false;
  let osName = null;

  // get is touchable
  if (window.ontouchstart === null) {
    isTouchable = true;
  }

  // get os name by user agent
  switch (true) {
    case (ua.indexOf('Macintosh') !== -1):
      osName = 'mac';
      break;
    case (ua.indexOf('Windows') !== -1):
      osName = 'win';
      break;
    case (ua.indexOf('Android') !== -1):
      osName = 'android';
      break;
    case (ua.indexOf('iPhone') !== -1):
      osName = 'ios';
      break;
      defalut:
        osName = 'unknown';
        break;
  }

  // judgement ui
  let isMobileUI = false;

  switch (true) {
    case (isTouchable && osName == 'android'):
      isMobileUI = true;
      break;
    case (isTouchable && osName == 'ios'):
      isMobileUI = true;
      break;
  }
  return isMobileUI;
};
