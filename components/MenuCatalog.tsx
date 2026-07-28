import { HomeMenuCatalog } from "@/components/menu/HomeMenuCatalog";
import { ServerMenuCatalog } from "@/components/menu/ServerMenuCatalog";
import {
  fullMenuGroups,
  getMenuCategoryItems,
  menuCategoryPages
} from "@/data/menu-pages";
import { menuItems } from "@/data/menu";

const homeMenuCategories = menuCategoryPages.map((category) => ({
  slug: category.slug,
  label: category.label,
  count: getMenuCategoryItems(category.slug).length
}));

export function MenuCatalog() {
  return (
    <div className="mt-9 min-w-0 text-left sm:mt-14">
      <HomeMenuCatalog
        categories={homeMenuCategories}
        totalItems={menuItems.length}
      >
        <ServerMenuCatalog
          groups={fullMenuGroups}
          eagerFirstItems={false}
        />
      </HomeMenuCatalog>
    </div>
  );
}
