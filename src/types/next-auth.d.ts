import "next-auth"
import "@auth/core/types"
import "@auth/core/jwt"

declare module "next-auth" {
  interface User {
    companyId: string
    role: string
    firstName: string
    lastName: string
  }
  interface Session {
    user: {
      id: string
      email: string
      companyId: string
      role: string
      firstName: string
      lastName: string
    }
  }
}

declare module "@auth/core/types" {
  interface User {
    companyId: string
    role: string
    firstName: string
    lastName: string
  }
  interface Session {
    user: {
      id: string
      email: string
      companyId: string
      role: string
      firstName: string
      lastName: string
    }
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string
    companyId: string
    role: string
    firstName: string
    lastName: string
  }
}
