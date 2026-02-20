export const saveObjectToLocal = async (data: Record<string, unknown>): Promise<void> => {
  if (window.chrome && window.chrome.hasOwnProperty('storage')) {
    await window.chrome.storage.local.set(data);
  } else {
    Object.keys(data).forEach((key: string) => localStorage.setItem(key, JSON.stringify(data[key])));
  }
};

export const loadObjectFromLocal = async <T>(keys: Array<string>): Promise<T> => {
  if (window.chrome && window.chrome.hasOwnProperty('storage')) {
    return await window.chrome.storage.local.get(keys) as Promise<T>;
  } else {
    let data: Record<string, unknown> = {};
    keys.forEach((key: string) => {
      const value: string | null = localStorage.getItem(key);

      if (value) {
        data[key] = JSON.parse(value);
      }
    });
    return data as T;
  }
}

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

