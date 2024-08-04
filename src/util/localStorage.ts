// import { PokemonBox } from "./interfaces";

export const saveToLocal = async (key: string, data: any): Promise<void> => {
  const formattedData = JSON.stringify(data);

  if (window.chrome && window.chrome.hasOwnProperty('storage')) {
    await window.chrome.storage.local.set({ [key]: formattedData });
  } else {
    localStorage.setItem(key, formattedData);
  }
};

export const loadFromLocal = async (key: string): Promise<any> => {
  let value: any = null;

  if (window.chrome && window.chrome.hasOwnProperty('storage')) {
    value = await window.chrome.storage.local.get([key]);
    if (value[key]) {
      return JSON.parse(value[key]);
    } else {
      return null;
    }
  } else {
    value = JSON.parse(localStorage.getItem(key) as string);
  }

  return value;
}

export const clearAllLocalData = async (): Promise<void> => {
  if (window.chrome && window.chrome.hasOwnProperty('storage')) {
    await chrome.storage.local.clear();
  } else {
    localStorage.clear();
  }
};

