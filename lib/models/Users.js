const pool = require('../utils/pool');

module.exports = class User {
    google_id;
    notifications;

    constructor(row) {
        this.google_id = row.google_id;
        this.notifications = row.notifications;
    }

    static async insert({ google_id, notifications }) {
        const { rows } = await pool.query('INSERT INTO users (google_id, notifications) VALUES ($1, $2) RETURNING *', [google_id, notifications]);

        return new User(rows[0]);
    }
}