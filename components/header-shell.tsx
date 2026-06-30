"use client";

import { useState } from "react";
import { Header } from "@/components/header";

export function HeaderShell() {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <Header searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} />
  );
}
