"use client";
import { useEffect, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { ListQuery, Paginated, ProductDTO } from "@/types";

export function useDebounce<T>(value: T, ms = 400) {
  const [v, setV] = useState(value);
  useEffect(() => { const t = setTimeout(() => setV(value), ms); return () => clearTimeout(t); }, [value, ms]);
  return v;
}

export function useProducts(filters: Partial<ListQuery>) {
  const params = new URLSearchParams(
    Object.entries(filters).filter(([, v]) => v !== undefined && v !== "").map(([k, v]) => [k, String(v)])
  );
  return useQuery<Paginated<ProductDTO>>({
    queryKey: ["products", params.toString()],
    queryFn: async () => {
      const r = await fetch(`/api/v1/products?${params}`);
      if (!r.ok) throw new Error("Failed to load products");
      return r.json();
    },
    placeholderData: keepPreviousData,
  });
}
