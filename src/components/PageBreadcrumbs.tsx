import { type Breadcrumb as BreadcrumbType } from "@/utils/breadcrumbs/types";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Fragment } from "react";

type PageBreadcrumbsProps = {
  breadcrumbs: BreadcrumbType[];
};

export function PageBreadcrumbs({ breadcrumbs }: PageBreadcrumbsProps) {
  const breadcrumbsCount = breadcrumbs.length;

  return (
    <Breadcrumb className="w-full">
      <BreadcrumbList>
        {breadcrumbs.map(({ href, label }, index) => {
          if (index === breadcrumbsCount - 1) {
            return (
              <BreadcrumbItem key={href}>
                <BreadcrumbPage>{label}</BreadcrumbPage>
              </BreadcrumbItem>
            );
          }

          return (
            <Fragment key={href}>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={href}>{label}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
