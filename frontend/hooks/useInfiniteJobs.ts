import { Job } from "@/components/JobCard";
import { FilterOptions } from "@/components/JobFilters";
import { generateMockJobs } from "@/lib/mockData";
import { useCallback, useState } from "react";

const JOBS_PER_PAGE = 9;
const TOTAL_JOBS = 50; // Simulate total available jobs

export function useInfiniteJobs() {
  const [jobs, setJobs] = useState<Job[]>(() =>
    generateMockJobs(JOBS_PER_PAGE, 0)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: "",
    location: "all",
    jobType: "all",
  });

  const hasMore = jobs.length < TOTAL_JOBS;

  const loadMoreJobs = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const newJobs = generateMockJobs(JOBS_PER_PAGE, jobs.length);
      setJobs((prev) => [...prev, ...newJobs]);
      setIsLoading(false);
    }, 1000);
  }, [isLoading, hasMore, jobs.length]);

  const filterJobs = useCallback(
    (allJobs: Job[], filterOptions: FilterOptions) => {
      return allJobs.filter((job) => {
        const matchesSearch =
          filterOptions.searchQuery === "" ||
          job.title
            .toLowerCase()
            .includes(filterOptions.searchQuery.toLowerCase()) ||
          job.company
            .toLowerCase()
            .includes(filterOptions.searchQuery.toLowerCase());

        const matchesLocation =
          filterOptions.location === "all" ||
          job.location.includes(filterOptions.location);

        const matchesJobType =
          filterOptions.jobType === "all" ||
          job.jobType === filterOptions.jobType;

        return matchesSearch && matchesLocation && matchesJobType;
      });
    },
    []
  );

  const filteredJobs = filterJobs(jobs, filters);

  const handleFilterChange = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
  }, []);

  return {
    jobs: filteredJobs,
    allJobsCount: jobs.length,
    isLoading,
    hasMore,
    filters,
    loadMoreJobs,
    handleFilterChange,
  };
}
