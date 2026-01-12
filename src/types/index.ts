export interface FileNode {
  _id: string;
  name: string;
  type:
    | "folder"
    | "text"
    | "image"
    | "audio"
    | "video"
    | "document"
    | "archive"
    | "other";
  parentId: string | null;
  content?: string;
  url?: string;
  size?: number;
  mimeType?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Breadcrumb {
  _id: string;
  name: string;
}

export interface ContextMenuState {
  x: number;
  y: number;
  itemId: string | null;
}
