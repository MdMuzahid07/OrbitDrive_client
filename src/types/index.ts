export interface FileNode {
  _id: string;
  name: string;
  type: "folder" | "text" | "image";
  parentId: string | null;
  content?: string;
  url?: string;
  size?: number;
  mimeType?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNodePayload {
  name: string;
  type: "folder" | "text";
  parentId: string;
  content?: string;
}

export interface ContextMenuState {
  x: number;
  y: number;
  itemId: string | null;
}
