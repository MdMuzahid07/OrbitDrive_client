/* eslint-disable @typescript-eslint/no-explicit-any */
import { FileNode } from "../../../types";
import { CreateNodePayload } from "../../../types/fileSystem";
import baseApi from "../../api/baseApi";

const fileSystemApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllNodes: builder.query<FileNode[], void>({
      query: () => "/filesystem/all",
      transformResponse: (res: any) => res.data,
      providesTags: ["Nodes"],
    }),

    getNodesByParent: builder.query<FileNode[], string>({
      query: (parentId) => ({
        url: "/filesystem",
        params: { parentId: parentId === "root" ? undefined : parentId },
      }),
      transformResponse: (res: any) => res.data,
      providesTags: (result, error, parentId) => [
        { type: "Nodes", id: parentId },
      ],
    }),

    createNode: builder.mutation<FileNode, CreateNodePayload>({
      query: (payload) => ({
        url: "/filesystem",
        method: "POST",
        body: payload,
      }),
      transformResponse: (res: any) => res.data,
      invalidatesTags: ["Nodes"],
    }),

    // Upload multiple or single files
    uploadFiles: builder.mutation<
      FileNode | FileNode[],
      { files: File | File[]; parentId: string }
    >({
      query: ({ files, parentId }) => {
        const formData = new FormData();

        if (Array.isArray(files)) {
          files.forEach((file) => {
            formData.append("files", file);
          });
        } else {
          formData.append("file", files);
        }

        formData.append("parentId", parentId);

        return {
          url: "/filesystem/upload",
          method: "POST",
          body: formData,
        };
      },
      transformResponse: (res: any) => res.data,
      invalidatesTags: ["Nodes"],
    }),

    updateNode: builder.mutation<
      FileNode,
      { id: string; name?: string; content?: string }
    >({
      query: ({ id, ...payload }) => ({
        url: `/filesystem/${id}`,
        method: "PATCH",
        body: payload,
      }),
      transformResponse: (res: any) => res.data,
      invalidatesTags: ["Nodes"],
    }),

    deleteNode: builder.mutation<void, string>({
      query: (id) => ({
        url: `/filesystem/${id}`,
        method: "DELETE",
      }),
      transformResponse: (res: any) => res.data,
      invalidatesTags: ["Nodes"],
    }),

    getBreadcrumbs: builder.query<Array<{ _id: string; name: string }>, string>(
      {
        query: (folderId) => `/filesystem/${folderId}/breadcrumbs`,
        transformResponse: (res: any) => res.data,
      },
    ),
  }),
});

export const {
  useGetAllNodesQuery,
  useGetNodesByParentQuery,
  useCreateNodeMutation,
  useUploadFilesMutation,
  useUpdateNodeMutation,
  useDeleteNodeMutation,
  useGetBreadcrumbsQuery,
} = fileSystemApi;

export default fileSystemApi;
