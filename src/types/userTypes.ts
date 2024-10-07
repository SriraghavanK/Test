// src/types/userTypes.ts

// userTypes.ts
export interface User {
    _id: string;
    name: string;
    email: string;
    address?: string;
    phone?: string;
    isAdmin?: boolean; // Add this line
  }
  
  
  export interface AuthContextType {
    user: User | null; // User can be null if not authenticated
    logout: () => void;
    // Add other properties and methods related to authentication
  }
  