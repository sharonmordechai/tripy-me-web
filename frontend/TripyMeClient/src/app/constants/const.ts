/**
 * AUTH/OAUTH2 KEYS
 */
export const ACCESS_TOKEN_KEY = 'AuthToken';
export const ACCESS_EMAIL_KEY = 'AuthEmail';
export const ACCESS_AUTHORITIES_KEY = 'AuthAuthorities';

export const API_BASE_URL = 'http://localhost:8080';
export const OAUTH2_REDIRECT_URI = 'http://localhost:4200/oauth2/redirect';

export const GOOGLE_URL = API_BASE_URL + '/oauth2/authorize/google?redirect_uri=' + OAUTH2_REDIRECT_URI;
export const FACEBOOK_URL = API_BASE_URL + '/oauth2/authorize/facebook?redirect_uri=' + OAUTH2_REDIRECT_URI;

/**
 * REST API
 */
export const PROXY_URL = 'server';
export const LOGIN_URL = PROXY_URL + '/auth/login';
export const SIGNUP_URL = PROXY_URL + '/auth/signup';

export const COUNTRY_URL = PROXY_URL + '/countries';

export const USER_URL = PROXY_URL + '/user/me';
export const ADMIN_URL = PROXY_URL + '/admin';

export const EMAIL_VALIDATION_MESSAGES = {
  required: 'Please enter your email address.',
  email: 'Please enter a valid email address.'
};

export const PASSWORD_VALIDATION_MESSAGES = {
  required: 'Please enter your password.',
  minlength: 'The password must be longer than 6 characters.'
};

export const NAME_VALIDATION_MESSAGES = {
  required: 'Please enter your name.',
  minlength: 'The name must be longer than 3 characters.'
};
