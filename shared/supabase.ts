// Database URL configuration for PostgreSQL
export const getDatabaseUrl = () => {
  return process.env.DATABASE_URL || 'postgresql://localhost:5432/postgres';
};