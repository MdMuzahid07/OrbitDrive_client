import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ContextMenuState, FileNode } from "../../../types";

export interface FileSystemState {
  currentFolderId: string;
  expandedFolders: string[];
  contextMenu: ContextMenuState | null;
  openFile: FileNode | null;
  sidebarOpen: boolean;
}

const initialState: FileSystemState = {
  currentFolderId: "root",
  expandedFolders: ["root"],
  openFile: null,
  contextMenu: null,
  sidebarOpen: false,
};

const fileSystemSlice = createSlice({
  name: "fileSystem",
  initialState,
  reducers: {
    setCurrentFolderId: (state, action: PayloadAction<string>) => {
      state.currentFolderId = action.payload;
    },
    toggleFolderExpansion: (state, action: PayloadAction<string>) => {
      const index = state.expandedFolders.indexOf(action.payload);
      if (index > -1) {
        state.expandedFolders.splice(index, 1);
      } else {
        state.expandedFolders.push(action.payload);
      }
    },
    setExpandedFolders: (state, action: PayloadAction<string[]>) => {
      state.expandedFolders = action.payload;
    },
    setContextMenu: (state, action: PayloadAction<ContextMenuState | null>) => {
      state.contextMenu = action.payload;
    },
    setOpenFile: (state, action: PayloadAction<FileNode | null>) => {
      state.openFile = action.payload;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
  },
});

export const {
  setCurrentFolderId,
  toggleFolderExpansion,
  setExpandedFolders,
  setContextMenu,
  setOpenFile,
  setSidebarOpen,
} = fileSystemSlice.actions;

export default fileSystemSlice.reducer;
