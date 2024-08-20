import { PageForLoggedInUsersOnly } from "@/components/PageForLoggedInUsersOnly";
import { EnumPageErrorType, type PageError } from "@/utils/constants/error";

type GetErrorComponentProps = {
  type: PageError;
  redirect: string;
};

function getErrorComponent({ type, redirect }: GetErrorComponentProps) {
  switch (type) {
    case EnumPageErrorType.UserNotLoggedIn:
      return <PageForLoggedInUsersOnly redirect={redirect} />;
    default:
      <div>ERROR</div>;
  }
}

type ErrorPageProps = {
  params: {
    type: PageError;
  };
  searchParams: {
    redirect: string;
  };
};

export default function ErrorPage({
  params: { type },
  searchParams: { redirect },
}: ErrorPageProps) {
  const errorComponent = getErrorComponent({ type, redirect });

  return errorComponent;
}
