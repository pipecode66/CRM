import "next-auth";
import "next-auth/jwt";

import type { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      locale: string;
      branchIds: string[];
    } & DefaultSession["user"];
  }

  interface User {
    role?: Role;
    locale?: string;
    branchIds?: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
    locale?: string;
    branchIds?: string[];
  }
}

