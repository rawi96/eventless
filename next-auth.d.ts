import { CompanyAccountWithBoth } from '@/types/prisma';
import { Account, CompanyAccount, Company, PaymentTerm } from '@prisma/client';
import { User } from 'next-auth';
import 'next-auth/jwt';

// Read more at: https://next-auth.js.org/getting-started/typescript#module-augmentation

declare module 'next-auth' {
  interface User {
    id: string;
    name: string;
    email: string;
    image: string;
  }

  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user?: User;
  }
}
