import { ChevronRight, Home, Menu } from "lucide-react";
import { Fragment } from "react";
import { useGetBreadcrumbsQuery } from "../redux/features/fileSystem/fileSystem.api";
import { setCurrentFolderId } from "../redux/features/fileSystem/fileSystem.slice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

const Breadcrumbs = ({ sidebarToggle }: { sidebarToggle: () => void }) => {
  const dispatch = useAppDispatch();
  const { currentFolderId } = useAppSelector((state) => state.filesystem);

  const { data: breadcrumbs = [] } = useGetBreadcrumbsQuery(currentFolderId, {
    skip: currentFolderId === "root",
  });

  const handleClick = (folderId: string) => {
    dispatch(setCurrentFolderId(folderId));
  };

  return (
    <header className="bg-cyber-surface/40 sticky top-0 z-50 flex h-20 items-center border-b border-white/5 px-6 backdrop-blur-xl">
      {/* Sidebar Toggle */}
      <button
        onClick={sidebarToggle}
        className="group relative mr-6"
        title="Toggle Sidebar"
      >
        <div className="bg-cyber-gradient absolute inset-0 rounded-xl opacity-0 blur transition-opacity group-hover:opacity-40" />
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/3 text-white transition-all hover:bg-white/8">
          <Menu size={20} />
        </div>
      </button>

      {/* Breadcrumb Navigation */}
      <nav className="no-scrollbar flex flex-1 items-center gap-3 overflow-x-auto">
        <button
          onClick={() => handleClick("root")}
          className="group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all hover:bg-white/5"
        >
          <div
            className={`bg-cyber-gradient absolute inset-0 rounded-xl opacity-0 blur transition-opacity ${currentFolderId === "root" ? "opacity-20" : "group-hover:opacity-10"}`}
          />
          <Home
            size={18}
            className={`transition-colors ${currentFolderId === "root" ? "text-cyber-blue" : "text-white/40 group-hover:text-white/80"}`}
          />
        </button>

        {breadcrumbs.length > 0 && (
          <div className="flex items-center gap-3">
            {breadcrumbs.map((crumb, index) => (
              <Fragment key={crumb._id}>
                <ChevronRight
                  size={14}
                  className="shrink-0 text-white/10 ring-blue-500"
                />
                <button
                  onClick={() => handleClick(crumb._id)}
                  className={`relative rounded-lg px-3 py-1.5 text-sm font-bold tracking-tight whitespace-nowrap transition-all ${
                    index === breadcrumbs.length - 1
                      ? "bg-white/5 text-white shadow-[0_0_15px_-5px_rgba(139,92,246,0.3)]"
                      : "text-white/40 hover:bg-white/3 hover:text-white/80"
                  }`}
                >
                  {crumb.name}
                </button>
              </Fragment>
            ))}
          </div>
        )}
      </nav>

      {/* Right side actions - Space for future features like Search/Upload */}
      <div className="ml-4 flex items-center gap-4">
        {/* Placeholder for future top-bar tools */}
      </div>
    </header>
  );
};

export default Breadcrumbs;
