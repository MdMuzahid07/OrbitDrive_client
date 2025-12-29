import { CreateNodePayload, FileNode } from "../../../types";
import baseApi from "../../api/baseApi";

const fileSystemApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllNodes: builder.query<FileNode[], void>({
      query: () => "/nodes/all",
      providesTags: ["Nodes"],
    }),

    createNode: builder.mutation<FileNode, CreateNodePayload>({
      query: (payload) => ({
        url: "/nodes",
        method: "POST",
        body: payload,
      }),
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
          url: "/nodes/upload",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Nodes"],
    }),

    renameNode: builder.mutation<FileNode, { id: string; name: string }>({
      query: ({ id, name }) => ({
        url: `/nodes/${id}/rename`,
        method: "PATCH",
        body: { name },
      }),
      invalidatesTags: ["Nodes"],
    }),

    updateNodeContent: builder.mutation<
      FileNode,
      { id: string; content: string }
    >({
      query: ({ id, content }) => ({
        url: `/nodes/${id}/content`,
        method: "PATCH",
        body: { content },
      }),
      invalidatesTags: ["Nodes"],
    }),

    deleteNode: builder.mutation<void, string>({
      query: (id) => ({
        url: `/nodes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Nodes"],
    }),
  }),
});

export const {
  useGetAllNodesQuery,
  useCreateNodeMutation,
  useUploadFilesMutation,
  useRenameNodeMutation,
  useUpdateNodeContentMutation,
  useDeleteNodeMutation,
} = fileSystemApi;

export default fileSystemApi;
