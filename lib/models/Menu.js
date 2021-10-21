const pool = require('../utils/pool');

// Make sure to use consistent naming conventions (snake_case in Postgres vs. camelCase in JavaScript)
module.exports = class Menu {
  id;
  user_id;
  meal_name;
  ingredients;

  constructor(row) {
    this.id = row.id;
    this.user_id = row.user_id;
    this.meal_name = row.meal_name;
    this.ingredients = row.ingredients;
  }

  static async insert({ user_id, meal_name, ingredients }) {
    const { rows } = await pool.query(
      'INSERT INTO menus (user_id, meal_name, ingredients) VALUES ($1, $2, $3) RETURNING *',
      [user_id, meal_name, ingredients]
    );

    return new Menu(rows[0]);
  }

  static async getById(id) {
    const { rows } = await pool.query('SELECT * from menus WHERE id=$1', [id]);

    return new Menu(rows[0]);
  }

  static async getAll() { 
    const { rows } = await pool.query('SELECT * FROM menus')

    return rows.map((row) => new Menu(row));
  }

  static async updateById(id, { user_id, meal_name, ingredients }) {
    const existingMeal = await Menu.getById(id);
    const newUserId = user_id ?? existingMeal.user_id;
    const newMealName = meal_name ?? existingMeal.meal_name;
    const newIngredients = ingredients ?? existingMeal.ingredients;

    const { rows } = await pool.query(
      `
          UPDATE menus 
          SET
          user_id=$1,
          meal_name=$2,
          ingredients=$3
          WHERE id=$4
          RETURNING *
        `,
      [newUserId, newMealName, newIngredients, id]
    );

    return new Menu(rows[0]);
  }
};
