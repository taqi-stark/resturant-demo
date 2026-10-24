import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type MenuCategory = {
  id: string;
  name: string;
  sort_order: number;
};

export type MenuItem = {
  id: string;
  category_id: string | null;
  name: string;
  description: string;
  price: number;
  is_available: boolean;
  sort_order: number;
};

export const menuQuery = queryOptions({
  queryKey: ["menu"],
  queryFn: async () => {
    const [categories, items] = await Promise.all([
      supabase.from("menu_categories").select("*").order("sort_order"),
      supabase.from("menu_items").select("*").order("sort_order"),
    ]);
    if (categories.error) throw categories.error;
    if (items.error) throw items.error;
    return {
      categories: (categories.data ?? []) as MenuCategory[],
      items: ((items.data ?? []) as unknown as MenuItem[]).map((i) => ({
        ...i,
        price: Number(i.price),
      })),
    };
  },
});
