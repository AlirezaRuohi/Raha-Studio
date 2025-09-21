import mysql from "mysql2/promise";

let pool: mysql.Pool;

export function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST,      // هاست دیتابیس از DirectAdmin
      user: process.env.MYSQL_USER,      // یوزر دیتابیس
      password: process.env.MYSQL_PASS,  // پسورد دیتابیس
      database: process.env.MYSQL_DB,    // اسم دیتابیس
      waitForConnections: true,
      connectionLimit: 10,
    });
  }
  return pool;
}
