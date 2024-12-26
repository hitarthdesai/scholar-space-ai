import { type Breadcrumbs } from "@/utils/breadcrumbs/types";
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
  breadcrumbs: Breadcrumbs;
};

export function PageBreadcrumbs({ breadcrumbs }: PageBreadcrumbsProps) {
  return (
    <Breadcrumb className="w-full">
      <BreadcrumbList>
        {breadcrumbs.links.map(({ href, label }) => {
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
        <BreadcrumbItem>
          <BreadcrumbPage>{breadcrumbs.item.label}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
