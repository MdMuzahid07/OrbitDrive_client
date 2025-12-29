import { ChevronRight, Home } from "lucide-react";
import { FC, Fragment } from "react";
import { useGetBreadcrumbsQuery } from "../redux/features/fileSystem/fileSystem.api";
import { setCurrentFolderId } from "../redux/features/fileSystem/fileSystem.slice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

const Breadcrumbs: FC = () => {
  const dispatch = useAppDispatch();
  const { currentFolderId } = useAppSelector((state) => state.filesystem);

  // Skip query for root node
  const { data: breadcrumbs = [] } = useGetBreadcrumbsQuery(currentFolderId, {
    skip: currentFolderId === "root",
  });

  const handleClick = (folderId: string) => {
    dispatch(setCurrentFolderId(folderId));
  };

  return (
    <div className="flex h-15.25 items-center gap-2 overflow-x-auto border-b px-4 text-sm">
      <Home
        size={16}
        className="shrink-0 cursor-pointer text-gray-600 hover:text-blue-600"
        onClick={() => handleClick("root")}
      />

      {breadcrumbs.length > 0 && (
        <>
          <ChevronRight size={14} className="shrink-0 text-gray-400" />
          {breadcrumbs.map((crumb, index) => (
            <Fragment key={crumb._id}>
              {index > 0 && (
                <ChevronRight size={14} className="shrink-0 text-gray-400" />
              )}
              <button
                onClick={() => handleClick(crumb._id)}
                className="whitespace-nowrap text-blue-600 hover:underline"
              >
                {crumb.name}
              </button>
            </Fragment>
          ))}
        </>
      )}
    </div>
  );
};

export default Breadcrumbs;
