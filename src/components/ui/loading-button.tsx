import { Loader2 } from "lucide-react";
import { Button, type ButtonProps } from "./button";

export const LoadingButton = ({
  children,
  isLoading,
  ...props
}: ButtonProps & { isLoading: boolean }) => {
  return (
    <Button {...props} disabled={isLoading}>
      {isLoading ? <Loader2 className="animate-spin p-0.5" /> : children}
    </Button>
  );
};
