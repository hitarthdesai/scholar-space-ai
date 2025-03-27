import { SubmissionsByQuestions } from "@/components/assignment/SubmissionsByQuestions";
import { NotAuthorizedToViewPage } from "@/components/NotAuthorizedToViewPage";
import { PageBreadcrumbs } from "@/components/PageBreadcrumbs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnumAccessType } from "@/schemas/dbTableAccessSchema";
import { auth } from "@/utils/auth/config";
import { getBreadcrumbsByPage } from "@/utils/breadcrumbs/getBreadcrumbsByPage";
import { canUserAccessAssignment } from "@/utils/classroom/canUserAccessAssignment";
import { EnumPage } from "@/utils/constants/page";
import assert from "assert";

const SubmissionsViewMode = {
  ByQuestion: "byQuestion",
  ByStudent: "byStudent",
} as const;

type PageProps = {
  params: {
    classroomId: string;
    assignmentId: string;
  };
};

export default async function SubmissionPage({
  params: { classroomId, assignmentId },
}: PageProps) {
  const session = await auth();
  const userId = session?.user?.id;
  assert(!!userId, "User must be logged in to view this page");

  const isAuthorizedToViewAssignment = await canUserAccessAssignment({
    assignmentId,
    classroomId,
    userId,
    accessType: EnumAccessType.Write,
  });

  if (!isAuthorizedToViewAssignment) {
    <NotAuthorizedToViewPage />;
  }

  const breadcrumbs = await getBreadcrumbsByPage({
    page: EnumPage.Submission,
    assignmentId,
  });

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <PageBreadcrumbs breadcrumbs={breadcrumbs} />
      <main className="flex h-full grow flex-col">
        <div>
          <Tabs defaultValue={SubmissionsViewMode.ByQuestion}>
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold">Submissions</h2>
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value={SubmissionsViewMode.ByQuestion}>
                  View by Question
                </TabsTrigger>
                <TabsTrigger value={SubmissionsViewMode.ByStudent}>
                  View by Submission
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value={SubmissionsViewMode.ByQuestion}>
              <SubmissionsByQuestions
                classroomId={classroomId}
                assignmentId={assignmentId}
              />
            </TabsContent>
            <TabsContent value={SubmissionsViewMode.ByStudent}>
              BY STUDENT
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
