import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Briefcase, MapPin, Search } from "lucide-react";

export interface FilterOptions {
  searchQuery: string;
  location: string;
  jobType: string;
}

interface JobFiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

export function JobFilters({ filters, onFilterChange }: JobFiltersProps) {
  const handleSearchChange = (value: string) => {
    onFilterChange({ ...filters, searchQuery: value });
  };

  const handleLocationChange = (value: string) => {
    onFilterChange({ ...filters, location: value });
  };

  const handleJobTypeChange = (value: string) => {
    onFilterChange({ ...filters, jobType: value });
  };

  const handleClearFilters = () => {
    onFilterChange({
      searchQuery: "",
      location: "all",
      jobType: "all",
    });
  };

  const hasActiveFilters =
    filters.searchQuery !== "" ||
    filters.location !== "all" ||
    filters.jobType !== "all";

  return (
    <Card className='mb-8'>
      <CardHeader>
        <div className='flex items-center gap-2 text-lg font-semibold'>
          <Search className='h-5 w-5' />
          Search & Filters
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {/* Search Field */}
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2'>
              <Search className='h-4 w-4' />
              Search Jobs
            </label>
            <Input
              type='text'
              placeholder='Search by title, company, or keywords...'
              value={filters.searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className='w-full'
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Location Filter */}
            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2'>
                <MapPin className='h-4 w-4' />
                Location
              </label>
              <Select
                value={filters.location}
                onValueChange={handleLocationChange}>
                <SelectTrigger>
                  <SelectValue placeholder='Select location' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Locations</SelectItem>
                  <SelectItem value='New York'>New York, NY</SelectItem>
                  <SelectItem value='San Francisco'>
                    San Francisco, CA
                  </SelectItem>
                  <SelectItem value='Austin'>Austin, TX</SelectItem>
                  <SelectItem value='Los Angeles'>Los Angeles, CA</SelectItem>
                  <SelectItem value='Seattle'>Seattle, WA</SelectItem>
                  <SelectItem value='Boston'>Boston, MA</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Job Type Filter */}
            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2'>
                <Briefcase className='h-4 w-4' />
                Job Type
              </label>
              <Select
                value={filters.jobType}
                onValueChange={handleJobTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder='Select job type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Types</SelectItem>
                  <SelectItem value='Full-time'>Full-time</SelectItem>
                  <SelectItem value='Part-time'>Part-time</SelectItem>
                  <SelectItem value='Remote'>Remote</SelectItem>
                  <SelectItem value='Contract'>Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className='mt-4 flex items-center gap-2 flex-wrap'>
              <span className='text-sm text-gray-600 dark:text-gray-400'>
                Active filters:
              </span>
              {filters.searchQuery && (
                <Badge variant='secondary'>
                  Search: &quot;{filters.searchQuery}&quot;
                </Badge>
              )}
              {filters.location !== "all" && (
                <Badge variant='secondary'>Location: {filters.location}</Badge>
              )}
              {filters.jobType !== "all" && (
                <Badge variant='secondary'>Type: {filters.jobType}</Badge>
              )}
              <Button
                variant='ghost'
                size='sm'
                onClick={handleClearFilters}
                className='h-6 text-xs'>
                Clear all
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
