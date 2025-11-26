import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, MapPin } from "lucide-react";

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  jobType: string;
}

interface JobCardProps {
  job: Job;
  onViewDetails?: (jobId: number) => void;
}

const getJobTypeBadgeVariant = (
  jobType: string
): "default" | "secondary" | "outline" | "destructive" => {
  switch (jobType) {
    case "Full-time":
      return "default";
    case "Remote":
      return "secondary";
    case "Part-time":
      return "outline";
    case "Contract":
      return "destructive";
    default:
      return "default";
  }
};

export function JobCard({ job, onViewDetails }: JobCardProps) {
  return (
    <Card className='hover:shadow-lg transition-shadow cursor-pointer'>
      <CardContent className='p-6'>
        <div className='space-y-4'>
          {/* Job Type Badge */}
          <div className='flex justify-between items-start'>
            <Badge variant={getJobTypeBadgeVariant(job.jobType)}>
              {job.jobType}
            </Badge>
          </div>

          {/* Job Title */}
          <h3 className='text-xl font-semibold text-gray-900 dark:text-white line-clamp-2'>
            {job.title}
          </h3>

          {/* Company */}
          <div className='flex items-center gap-2 text-gray-600 dark:text-gray-400'>
            <Building2 className='h-4 w-4' />
            <span className='text-sm'>{job.company}</span>
          </div>

          {/* Location */}
          <div className='flex items-center gap-2 text-gray-600 dark:text-gray-400'>
            <MapPin className='h-4 w-4' />
            <span className='text-sm'>{job.location}</span>
          </div>

          {/* View Details Button */}
          <Button
            className='w-full mt-4'
            variant='outline'
            onClick={() => onViewDetails?.(job.id)}>
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
