export const saveToLocal = async (key: string, data: any): Promise<void> => {
  if (chrome && chrome.hasOwnProperty('storage')) {
    await chrome.storage.local.set({ key: data });
  } else {
    const formattedData = JSON.stringify(data);
    localStorage.setItem(key, formattedData);
  }
};

export const loadFromLocal = async (key: string): Promise<any> => {
  let value: any = null;
  if (chrome && chrome.hasOwnProperty('storage')) {
    value = await chrome.storage.local.get([key]);
  } else {
    value = JSON.parse(localStorage.getItem(key) as string);
  }

  return value;
}

export const clearAllLocalData = async (): Promise<void> => {
  if (chrome && chrome.hasOwnProperty('storage')) {
    await chrome.storage.local.clear();
  } else {
    localStorage.clear();
  }
};

