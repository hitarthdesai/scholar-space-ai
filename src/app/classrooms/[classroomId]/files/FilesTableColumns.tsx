import { Button } from "@/components/ui/button";
import { ArrowUpDown, PencilIcon } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { EnumFormMode } from "@/schemas/formSchema";
import { type File } from "@/schemas/fileSchema";
import { AddEditFileSheet } from "@/components/files/AddEditFileSheet";

type GetColumnsProps = {
  classroomId: string;
  canAddOrEditFiles: boolean;
};

export const getColumns = ({
  classroomId,
  canAddOrEditFiles,
}: GetColumnsProps): ColumnDef<File>[] => [
  {
    accessorKey: "index",
    header: "#",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "added",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Added
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const formattedDate = new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "medium",
      }).format(row.original.added);

      return <time dateTime={formattedDate}>{formattedDate}</time>;
    },
  },
  {
    id: "actions",
    cell: () => (
      <>
        {canAddOrEditFiles && (
          <AddEditFileSheet mode={EnumFormMode.Add} classroomId={classroomId}>
            <Button
              variant="ghost"
              className="flex h-full items-center justify-center"
            >
              <PencilIcon className="h-3 w-3" />
            </Button>
          </AddEditFileSheet>
        )}
      </>
    ),
  },
];
