declare global {
    namespace NodeJS {
      interface Global {
        mongoose: {
          conn: any; // Mongoose connection, can use mongoose.Connection type for stricter typing
          promise: Promise<any> | null;
        };
      }
    }
  }
  
  export {};
  