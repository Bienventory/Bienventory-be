const pool = require('../utils/pool');
const Inventory = require('./Inventory');

// Make sure to use consistent naming conventions (snake_case in Postgres vs. camelCase in JavaScript)
module.exports = class User {
  google_id;
  notifications;
  phone_number;

  constructor(row) {
    this.google_id = row.google_id;
    this.notifications = row.notifications;
    this.phone_number = row.phone_number;
  }

  static async insert({ google_id, notifications, phone_number }) {
    const { rows } = await pool.query(
      'INSERT INTO users (google_id, notifications, phone_number) VALUES ($1, $2, $3) RETURNING *',
      [google_id, notifications, phone_number]
    );

    return new User(rows[0]);
  }

  static async getById(google_id) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE google_id=$1',
      [google_id]
    );

    return new User(rows[0]);
  }

  static async updateById(google_id, { notifications, phone_number }) {
    const existingUser = await User.getById(google_id);
    const newNotifications = notifications ?? existingUser.notifications;
    const newNumber = phone_number ?? existingUser.phone_number;
    const { rows } = await pool.query(
      'UPDATE users SET notifications=$1, phone_number=$2 WHERE google_id=$3 RETURNING *',[
        newNotifications,
        newNumber,
        google_id
      ]
    );

    return new User(rows[0]);
  }

  static async delete(google_id) {
    const { rows } = await pool.query('DELETE FROM users WHERE google_id=$1 RETURNING *', [google_id]);

    return new User(rows[0]);
  }
};
