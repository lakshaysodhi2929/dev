import Cookies from 'js-cookie';

export const setCookie = (name: string, value: string) => {
  Cookies.set(name, value, { expires: 1/24 });
};

export const getCookie = (name: string) => {
  const value = Cookies.get(name);
  return value;
};

export const removeCookie = (name: string) => {
  Cookies.remove(name);
};