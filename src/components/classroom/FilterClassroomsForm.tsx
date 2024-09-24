"use client";

import { Form, FormControl, FormField, FormItem } from "../ui/form";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "../ui/select";
import {
  type ClassroomParticipantStatus,
  type ClassroomRole,
  EnumClassroomParticpantStatus,
  EnumClassroomRole,
  type FilterClassroomsForm as FilterClassroomsFormType,
} from "@/schemas/classroomSchema";
import { Input } from "../ui/input";
import { useDebouncedCallback } from "use-debounce";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

const allOptionsValue = "all";
type FilterClassroomsFormValues = {
  query: string;
  role?: ClassroomRole | typeof allOptionsValue;
  status?: ClassroomParticipantStatus | typeof allOptionsValue;
};

export function FilterClassroomsForm({
  query,
  role,
  status,
}: FilterClassroomsFormType) {
  const router = useRouter();
  const form = useForm<FilterClassroomsFormValues>({
    defaultValues: {
      query: query ?? "",
      role: role ?? allOptionsValue,
      status: status ?? allOptionsValue,
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    const newUrl = new URL(global.window.location.href);
    newUrl.searchParams.delete("query");
    newUrl.searchParams.delete("role");
    newUrl.searchParams.delete("status");

    if (data.query && data.query.length > 0) {
      newUrl.searchParams.set("query", data.query);
    }

    if (data.role && data.role !== allOptionsValue) {
      newUrl.searchParams.set("role", data.role);
    }

    if (data.status && data.status !== allOptionsValue) {
      newUrl.searchParams.set("status", data.status);
    }

    router.push(newUrl.href);
  });

  const debouncedSubmit = useDebouncedCallback(handleSubmit, 500);

  return (
    <Form {...form}>
      <form className="flex gap-3">
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Classroom name"
                  onChange={async (e) => {
                    field.onChange(e);
                    await debouncedSubmit();
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="min-w-28 max-w-28">
              <Select
                onValueChange={async (e) => {
                  field.onChange(e);
                  await debouncedSubmit();
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={EnumClassroomRole.Student}>
                    Student
                  </SelectItem>
                  <SelectItem value={EnumClassroomRole.TeachingAssistant}>
                    Teaching Assistant
                  </SelectItem>
                  <SelectItem value={EnumClassroomRole.Teacher}>
                    Teacher
                  </SelectItem>
                  <SelectItem value={EnumClassroomRole.Admin}>Admin</SelectItem>
                  <SelectItem value={allOptionsValue}>All</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="min-w-28 max-w-28">
              <Select
                onValueChange={async (e) => {
                  field.onChange(e);
                  await debouncedSubmit();
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={EnumClassroomParticpantStatus.Accepted}>
                    Accepted
                  </SelectItem>
                  <SelectItem value={EnumClassroomParticpantStatus.Invited}>
                    Invited
                  </SelectItem>
                  <SelectItem value={EnumClassroomParticpantStatus.Pending}>
                    Pending
                  </SelectItem>
                  <SelectItem value={allOptionsValue}>All</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
