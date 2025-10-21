"use client";

import React, { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { useGetUserProfileQuery } from "@/feature/profileSlice/profileSlice";
import { useGetAllStarOfPapersQuery } from "@/feature/star/StarSlice";
import {
  Paper,
  useGetAllPublishedPapersQuery,
} from "@/feature/paperSlice/papers";
import FavoriteCard from "@/components/card/FavoriteCard";
import { Search } from "lucide-react";

export default function Myfavorite() {
  const { data: userProfile } = useGetUserProfileQuery();
  const { data: userStars } = useGetAllStarOfPapersQuery();
  const { data: papers } = useGetAllPublishedPapersQuery({
    page: 0,
    size: 100,
  });
  const [searchQuery, setSearchQuery] = useState("");

  const allStars = userStars?.filter(
    (star) => star.userUuid === userProfile?.user.uuid
  );

  const papersWithStars: Paper[] | undefined = papers?.papers.content.filter(
    (paper) => allStars?.some((star) => star.paperUuid === paper.uuid)
  );

  const filteredPapers = useMemo(() => {
    const q = (searchQuery ?? "").trim().toLowerCase();
    if (!q) return papersWithStars;
    return papersWithStars?.filter((paper) => {
      const title = (paper.title ?? "").toLowerCase();
      const abstractText = (paper.abstractText ?? "").toLowerCase();
      const categories = (paper.categoryNames ?? []).join(" ").toLowerCase();
      const year = (paper.publishedAt ?? "").toString().toLowerCase();
      return (
        title.includes(q) ||
        abstractText.includes(q) ||
        categories.includes(q) ||
        year.includes(q)
      );
    });
  }, [papersWithStars, searchQuery]);

  return (
    <DashboardLayout
      userRole="adviser"
      userAvatar={userProfile?.user.imageUrl}
      userName={userProfile?.user.fullName}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            My Favorites Papers
          </h1>
          <p className="text-muted-foreground">
            Papers you&apos;ve downloaded from the platform
          </p>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Search Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search favorites by title, abstract, category or year..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <Button variant="outline">Filter</Button>
            </div>
          </CardContent>
        </Card>

        {/* Downloads List */}
        <div className="space-y-4">
          {filteredPapers?.map((paper) => (
            <FavoriteCard
              key={paper.uuid}
              id={paper.uuid}
              title={paper.title}
              journal={paper.categoryNames.join(", ")}
              year={paper.publishedAt}
              downloads={paper.downloads.toString()}
              abstract={paper.abstractText}
              tags={paper.categoryNames}
              image={paper.thumbnailUrl}
              onViewPaper={() => window.open(`/papers/${paper.uuid}`, "_blank")}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
