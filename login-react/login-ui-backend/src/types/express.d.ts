declare global {
  namespace Express {
    interface User {
      id: number;
      isAdmin: boolean;
      email: string;
      name: string;
      congregationNumber: number;
    }

    interface Request {
      user?: User;
    }
  }
}

export {};