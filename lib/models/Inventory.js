const pool = require('../utils/pool');

// Make sure to use consistent naming conventions (snake_case in Postgres vs. camelCase in JavaScript)
module.exports = class Inventory {
  id;
  user_id;
  item_name;
  description;
  total_on_hand;
  par;
  unit_type;

  constructor(row) {
    this.id = row.id;
    this.user_id = row.user_id;
    this.item_name = row.item_name;
    this.description = row.description;
    this.total_on_hand = row.total_on_hand;
    this.par = row.par;
    this.unit_type = row.unit_type;
  }

  static async insert({
    user_id,
    item_name,
    description,
    total_on_hand,
    par,
    unit_type,
  }) {
    const { rows } = await pool.query(
      'INSERT INTO inventory (user_id, item_name, description, total_on_hand, par, unit_type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [user_id, item_name, description, total_on_hand, par, unit_type]
    );
    return new Inventory(rows[0]);
  }

  static async getById(id) {
    const { rows } = await pool.query('SELECT * FROM inventory WHERE id=$1', [
      id,
    ]);
    return new Inventory(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM inventory');
    return rows.map((row) => new Inventory(row));
  }

  static async updateById(
    id,
    { user_id, item_name, description, total_on_hand, par, unit_type }
  ) {
    const currentItem = await Inventory.getById(id);
    const newUserId = user_id ?? currentItem.user_id;
    const newItemName = item_name ?? currentItem.item_name;
    const newDescription = description ?? currentItem.description;
    const newTotal = total_on_hand ?? currentItem.total_on_hand;
    const newPar = par ?? currentItem.par;
    const newUnit = unit_type ?? currentItem.unit_type;

    const { rows } = await pool.query(
      `
          UPDATE inventory
          SET 
          user_id=$1,
          item_name=$2,
          description=$3,
          total_on_hand=$4,
          par=$5,
          unit_type=$6
          WHERE id =$7
          RETURNING *
        `,
      [newUserId, newItemName, newDescription, newTotal, newPar, newUnit, id]
    );

    return new Inventory(rows[0]);
  }

  static async deleteById(id) {
    const { rows } = await pool.query(
      'DELETE FROM inventory WHERE id=$1 RETURNING *',
      [id]
    );
    return new Inventory(rows[0]);
  }

  static async getInventoryByUserId(user_id) {
    const { rows } = await pool.query(
      `
     SELECT 
       *
     FROM inventory
     INNER JOIN users
     ON inventory.user_id = users.google_id
     WHERE user_id=$1
    `,
      [user_id]
    );

    return rows.map((row) => new Inventory(row));
  }
};
