import { EllipsisIcon } from "lucide-react";
import {
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { ReactNode, useState } from "react";
import React from "react";

type MoreOptionsButtonProps = {
  components: ReactNode[];
};

export function MoreOptionsButton({ components }: MoreOptionsButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (open: boolean) => {
    setIsOpen(open);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleToggle}>
      <DropdownMenuTrigger asChild>
        <EllipsisIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {components.map((component, index) => {
          if (React.isValidElement(component)) {
            return React.cloneElement(component, {
              key: index,
              closeDropdown: closeDropdown,
            });
          }
          return <DropdownMenuItem key={index}>{component}</DropdownMenuItem>;
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
