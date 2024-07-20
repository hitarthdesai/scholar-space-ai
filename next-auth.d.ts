import { type Role } from "@/schemas/userSchema";
import "next-auth";

declare module "next-auth" {
  interface User {
    role: Role;
  }
}
