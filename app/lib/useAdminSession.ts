"use client";

import { useEffect, useState } from "react";

export function useAdminSession() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((res) => res.json())
      .then((data) => setIsAdmin(Boolean(data.isAdmin)))
      .catch(() => setIsAdmin(false))
      .finally(() => setIsLoading(false));
  }, []);

  return { isAdmin, isLoading, setIsAdmin };
}
