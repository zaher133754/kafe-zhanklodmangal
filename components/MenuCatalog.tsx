import { HomeMenuCatalog } from "@/components/menu/HomeMenuCatalog";
import { ServerMenuCatalog } from "@/components/menu/ServerMenuCatalog";
import { homeMenuGroups } from "@/data/menu-pages";
import { menuItems } from "@/data/menu";

const homeMenuCategories = homeMenuGroups.map((group) => ({
  slug: group.id,
  label: group.title,
  count: group.items.length
}));

export function MenuCatalog() {
  return (
    <div className="mt-9 min-w-0 text-left sm:mt-14">
      <HomeMenuCatalog
        categories={homeMenuCategories}
        totalItems={menuItems.length}
      >
        <ServerMenuCatalog
          groups={homeMenuGroups}
          eagerFirstItems={false}
        />
      </HomeMenuCatalog>
    </div>
  );
}
