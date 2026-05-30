export const TAGS = {
  news: 'News',
  events: 'Events',
  education: 'Education',
  initiatives: 'Initiatives',
  ads: 'Ads',
} as const;

export type NewsTag = (typeof TAGS)[keyof typeof TAGS];

export const MESSAGES = {
  imageUploadError: /Upload only PNG or JPG\. File size must be less than 10MB/i,
  mainTextLengthError: /Must be minimum 20 and maximum 63.?206 symbols/i,
  sourceUrlError:
    /Please add the link of original article\/news\/post\. Link must start with http\(s\):\/\//i,
  cancelModal: /All created content will be lost/i,
} as const;

export const ROUTES = {
  news: '/news',
  createNews: '/news/create-news',
} as const;
