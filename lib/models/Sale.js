const pool = require('../utils/pool');

// Make sure to use consistent naming conventions (snake_case in Postgres vs. camelCase in JavaScript)
module.exports = class Sale {
  id;
  user_id;
  sales;

  constructor(row) {
    this.id = row.id;
    this.user_id = row.user_id;
    this.sales = row.sales;
  }

  static async insert({ user_id, sales }) {
    const { rows } = await pool.query(
      `
          INSERT INTO sales
          (user_id, sales)  
          VALUES
          ($1, $2)
          RETURNING *
        `,
      [user_id, sales]
    );

    return new Sale(rows[0]);
  }
};
