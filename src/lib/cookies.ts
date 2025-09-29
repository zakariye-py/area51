import Cookies from 'js-cookie';

export const setCookie = (name: string, value: string, days: number = 30) => {
  Cookies.set(name, value, { expires: days, secure: true, sameSite: 'strict' });
};

export const getCookie = (name: string) => {
  return Cookies.get(name);
};

export const removeCookie = (name: string) => {
  Cookies.remove(name);
};

export const setUserCookie = (userData: any) => {
  setCookie('user_data', JSON.stringify(userData), 30);
};

export const getUserCookie = () => {
  const userData = getCookie('user_data');
  return userData ? JSON.parse(userData) : null;
};
