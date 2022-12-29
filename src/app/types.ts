export interface Tag {
  label: string;
  system?: boolean;
}

// TODO: should separate UI state from DB state
export interface Image {
  _id?: string;
  name: string;
  content: string;
  tags: Tag[];
  initialTags?: Tag[];
  createdAt?: string;
  toDelete?: boolean;
  lastModified?: number;
  isError?: boolean;
  isSelected?: boolean;
}

// export interface SavedImage extends AttachedImage {
//   _id: string;
//   createdAt: string;
//   toDelete?: boolean;
//   tags: Tag[];
//   initialTags?: Tag[];
// }
//
// export interface AttachedImage {
//   name: string;
//   content: string;
//   lastModified?: number;
//   tags?: Tag[];
//   isError?: boolean;
//   isSelected?: boolean;
// }
