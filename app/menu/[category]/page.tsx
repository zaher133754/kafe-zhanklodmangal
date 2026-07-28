import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MenuPageShell } from "@/components/menu/MenuPageShell";
import {
  getMenuCategoryItems,
  getMenuCategoryPage,
  isMenuCategorySlug,
  menuCategorySlugs,
  type MenuCategorySlug
} from "@/data/menu-pages";
import { menuBreadcrumbsJsonLd, menuJsonLd } from "@/lib/menu-json-ld";

export const dynamic = "force-static";
export const dynamicParams = false;

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return menuCategorySlugs.map((category) => ({ category }));
}

export async function generateMetadata({
  params
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;

  if (!isMenuCategorySlug(category)) {
    return {};
  }

  const page = getMenuCategoryPage(category);
  const items = getMenuCategoryItems(category);
  const path = `/menu/${category}`;

  return {
    title: page.heading,
    description: page.metaDescription,
    keywords: page.keywords,
    alternates: {
      canonical: path
    },
    openGraph: {
      type: "website",
      url: path,
      title: page.heading,
      description: page.metaDescription,
      images: [
        {
          url: items[0].image.src,
          width: items[0].image.width,
          height: items[0].image.height,
          alt: items[0].name
        }
      ]
    }
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;

  if (!isMenuCategorySlug(category)) {
    notFound();
  }

  const slug: MenuCategorySlug = category;
  const page = getMenuCategoryPage(slug);
  const items = getMenuCategoryItems(slug);
  const groups = [{ id: slug, title: page.label, items }];
  const path = `/menu/${slug}`;

  return (
    <MenuPageShell
      title={page.heading}
      groups={groups}
      activeCategory={slug}
      structuredData={[
        menuJsonLd({ name: page.heading, path, groups }),
        menuBreadcrumbsJsonLd({ name: page.label, path })
      ]}
    />
  );
}
