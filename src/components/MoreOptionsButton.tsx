import { EllipsisIcon } from "lucide-react";
import {
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { ReactNode } from "react";

type MoreOptionsButtonProps = {
  components: ReactNode[];
};

export function MoreOptionsButton({ components }: MoreOptionsButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <EllipsisIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {components.map((component, index) => (
          <DropdownMenuItem
            key={index}
            className="p-0"
            onSelect={(e) => e.preventDefault()}
          >
            {component}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
