import { useEffect, useMemo, useState } from "react";

export function useEmployeeFilters(employees) {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filtered = useMemo(() => {
    return employees.filter((employee) => {
      const matchSearch = search
        ? [employee.name, employee.email]
            .join(" ")
            .toLowerCase()
            .includes(search.toLowerCase())
        : true;

      const matchDepartment = department ? employee.department === department : true;
      const matchStatus = status ? employee.status === status : true;

      return matchSearch && matchDepartment && matchStatus;
    });
  }, [employees, search, department, status]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aValue = a[sortBy] ?? "";
      const bValue = b[sortBy] ?? "";

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sortBy, sortOrder]);

  const totalResults = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginated = useMemo(() => {
    const offset = (page - 1) * pageSize;
    return sorted.slice(offset, offset + pageSize);
  }, [sorted, page]);

  function handleSort(column) {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }

    setSortBy(column);
    setSortOrder("asc");
  }

  return {
    search,
    setSearch,
    department,
    setDepartment,
    status,
    setStatus,
    sortBy,
    sortOrder,
    handleSort,
    page,
    setPage,
    totalPages,
    paginated,
    totalResults,
  };
}
