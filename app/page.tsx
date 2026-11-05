"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, ArrowBigUp } from "lucide-react";
import Link from "next/link";
import { useDebounce, useProducts } from "@/hooks/use-products";
import { useFilters } from "@/lib/store";

const CATEGORIES = ["", "AI", "Web", "Mobile", "DevTools", "Hardware"];

export default function Home() {
  const { filters, set } = useFilters();
  const [text, setText] = useState("");
  const search = useDebounce(text);
  useEffect(() => set({ search }), [search]); // eslint-disable-line
  const { data, isLoading, error } = useProducts(filters);
  const hero = data?.items[0];

  return (
    <main className="mx-auto max-w-6xl space-y-8 p-4 md:p-8">
      {hero && (
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-gradient-to-br from-slate-900 to-teal-700 p-8 text-white">
          <p className="text-sm text-teal-200">Top product</p>
          <h1 className="text-3xl font-bold">{hero.title}</h1>
          <p className="mt-1 text-teal-100">{hero.tagline}</p>
          <Link href={`/products/${hero.slug}`} className="mt-4 inline-block rounded-lg bg-white px-4 py-2 font-semibold text-slate-900">View</Link>
        </motion.section>
      )}

      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Search products…"
            className="w-full rounded-lg border bg-transparent py-2 pl-9 pr-3" />
        </div>
        <select onChange={(e) => set({ category: e.target.value })} className="rounded-lg border bg-transparent p-2">
          {CATEGORIES.map((c) => <option key={c} value={c}>{c || "All categories"}</option>)}
        </select>
        <select onChange={(e) => set({ sort: e.target.value as any })} className="rounded-lg border bg-transparent p-2">
          <option value="top">Top rated</option><option value="new">Newest</option><option value="trending">Trending</option>
        </select>
      </div>

      {isLoading && <p>Loading…</p>}
      {error && <p className="text-red-500">{(error as Error).message}</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data?.items.map((p) => (
          <Link key={p.id} href={`/products/${p.slug}`} className="rounded-xl border p-4 transition hover:shadow-lg">
            <h3 className="font-semibold">{p.title}</h3>
            <p className="text-sm text-slate-500">{p.tagline}</p>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="rounded-full bg-teal-100 px-2 py-0.5 text-teal-800">{p.category}</span>
              <span className="flex items-center"><ArrowBigUp className="h-4 w-4" />{p.upvoteCount}</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
