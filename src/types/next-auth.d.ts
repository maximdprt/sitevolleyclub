import type { Role, UserStatus } from "@prisma/client";
import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    username: string;
    role: Role;
    status: UserStatus;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      username: string;
      role: Role;
      status: UserStatus;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    role: Role;
    status: UserStatus;
  }
}
