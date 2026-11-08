import filter from 'leo-profanity';

filter.loadDictionary('ru');

const englishDictionary = filter.getDictionary('en');
filter.add(englishDictionary);

export const cleanProfanity = (text) => {
  return filter.clean(text);
};