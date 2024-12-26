export type Breadcrumb = {
  label: string;
  href: string;
};
export type BreadcrumbWithoutHref = Pick<Breadcrumb, "label">;

export type Breadcrumbs = Breadcrumb[];
