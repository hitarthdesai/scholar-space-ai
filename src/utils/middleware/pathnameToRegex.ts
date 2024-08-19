export function pathnameToRegex(pathname: string): RegExp {
  return new RegExp("^" + pathname.replace(/:[^\s/]+/g, "([\\w-]+)") + "$");
}
