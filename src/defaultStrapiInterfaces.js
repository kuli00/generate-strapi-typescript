export const mediaInterface = `export interface Media {
  id: number;
  attributes: {
    name: string;
    alternativeText: string;
    caption: string;
    width: number;
    height: number;
    formats: {
      thumbnail: MediaFormat;
      medium: MediaFormat;
      small: MediaFormat;
      large: MediaFormat;
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string;
    provider: string;
    createdAt: Date;
    updatedAt: Date;
  }
}`;

export const mediaFormatInterface = `export interface MediaFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  path: string;
  url: string;
}`;

export const collectionDefaultAttributes = {
  createdAt: { type: 'date', required: true },
  updatedAt: { type: 'date' },
  publishedAt: { type: 'date' },
};
