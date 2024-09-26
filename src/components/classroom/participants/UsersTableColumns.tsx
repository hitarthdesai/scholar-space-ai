import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, PencilIcon } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { AddEditParticipantSheet } from "./AddEditParticpantSheet";
import { EnumFormMode } from "@/schemas/formSchema";
import { type ClassroomParticipant } from "@/schemas/classroomSchema";
import { roleBadgeStyles, statusBadgeStyles } from "@/utils/constants/misc";

type GetColumnsProps = {
  classroomId: string;
  canAddOrEditParticipants: boolean;
};

export const getColumns = ({
  classroomId,
  canAddOrEditParticipants,
}: GetColumnsProps): ColumnDef<ClassroomParticipant>[] => [
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
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role;
      return <Badge className={roleBadgeStyles[role]}>{role}</Badge>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant="outline" className={statusBadgeStyles[status]}>
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      const participant = {
        ...user,
        name: user.name ?? "",
      };

      return (
        <>
          {canAddOrEditParticipants && (
            <AddEditParticipantSheet
              mode={EnumFormMode.Edit}
              classroomId={classroomId}
              participant={participant}
            >
              <Button
                variant="ghost"
                className="flex h-full items-center justify-center"
              >
                <PencilIcon className="h-3 w-3" />
              </Button>
            </AddEditParticipantSheet>
          )}
        </>
      );
    },
  },
];
