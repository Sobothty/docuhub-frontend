"use client";
import React from "react";
import { useGetPapersQuery } from "@/feature/paperSlice/paperSlice";

export default function PapersSection() {
  const { data, isLoading, isError, error } = useGetPapersQuery();

  if (isLoading) return <div>Loading…</div>;
  if (isError) return <div>Failed to fetch papers</div>;

  if (data?.message?.includes("non-JSON")) {
    return (
      <div className="text-yellow-600">
        Server returned an error page — try again later.
      </div>
    );
  }

  const papers = data?.papers?.content ?? [];

  return (
    <div className="space-y-4 mt-52">
      {papers.length === 0 ? (
        <div className="space-y-4 mt-52">No published papers yet</div>
      ) : (
        papers.map((p) => <div key={p.uuid}>{p.title}</div>)
      )}
    </div>
  );
}
