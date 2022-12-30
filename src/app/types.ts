export interface Tag {
  label: string;
  isSystemTag?: boolean;
}

// TODO: Not proud of this - should separate UI state from DB state
export interface Image {
  _id?: string;
  name: string;
  content: string;
  tags: Tag[];
  initialTags: Tag[];
  createdAt?: string;
  toDelete?: boolean;
  lastModified?: number;
  isError?: boolean;
  isSelected?: boolean;
}
