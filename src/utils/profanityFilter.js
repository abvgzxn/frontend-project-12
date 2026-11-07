import filter from 'leo-profanity';

filter.loadDictionary('ru');

export const cleanProfanity = (text) => {
  return filter.clean(text)
};