
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type ProjectStage = 
  | "idea" 
  | "concept" 
  | "prototype" 
  | "mvp" 
  | "growth" 
  | "scaling";

export interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  stage: ProjectStage;
  owner: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  skills: string[];
  createdAt: string;
  isOwner?: boolean;
}

const stageBadgeColors: Record<ProjectStage, string> = {
  idea: "bg-blue-100 text-blue-800",
  concept: "bg-purple-100 text-purple-800",
  prototype: "bg-orange-100 text-orange-800",
  mvp: "bg-green-100 text-green-800",
  growth: "bg-teal-100 text-teal-800",
  scaling: "bg-red-100 text-red-800",
};

const stageLabels: Record<ProjectStage, string> = {
  idea: "Idea Stage",
  concept: "Concept Development",
  prototype: "Prototype",
  mvp: "Minimum Viable Product",
  growth: "Growth Stage",
  scaling: "Scaling",
};

const ProjectCard = ({
  id,
  title,
  description,
  stage,
  owner,
  skills,
  createdAt,
  isOwner = false,
}: ProjectCardProps) => {
  const truncateDescription = (text: string, maxLength = 120) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className={stageBadgeColors[stage]}>
            {stageLabels[stage]}
          </Badge>
          {isOwner && (
            <Badge variant="outline" className="bg-gray-100 text-gray-800">
              Your Project
            </Badge>
          )}
        </div>
        <CardTitle className="text-xl mt-2">
          <Link to={`/projects/${id}`} className="hover:text-cobrew-600">
            {title}
          </Link>
        </CardTitle>
        <CardDescription className="flex items-center gap-2 mt-1">
          <Avatar className="h-6 w-6">
            <AvatarImage src={owner.avatarUrl} />
            <AvatarFallback className="bg-cobrew-100 text-cobrew-800 text-xs">
              {getInitials(owner.name)}
            </AvatarFallback>
          </Avatar>
          <Link to={`/profile/${owner.id}`} className="text-sm hover:text-cobrew-600">
            {owner.name}
          </Link>
          <span className="text-xs text-gray-400">• {formatDate(createdAt)}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600 text-sm">
          {truncateDescription(description)}
        </p>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {skills.slice(0, 4).map((skill, index) => (
            <Badge key={index} variant="secondary" className="bg-gray-100">
              {skill}
            </Badge>
          ))}
          {skills.length > 4 && (
            <Badge variant="secondary" className="bg-gray-100">
              +{skills.length - 4} more
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 flex justify-between">
        <Link to={`/projects/${id}`}>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </Link>
        {!isOwner && (
          <Link to={`/projects/${id}/apply`}>
            <Button size="sm" className="bg-cobrew-600 hover:bg-cobrew-700">
              Apply
            </Button>
          </Link>
        )}
        {isOwner && (
          <Link to={`/projects/${id}/edit`}>
            <Button size="sm" variant="outline">
              Edit
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
