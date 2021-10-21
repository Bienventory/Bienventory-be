const Inventory = require('../models/Inventory');
const Sale = require('../models/Sale');
const Menu = require('../models/Menu');
const { sendText } = require('../utils/twilio');

module.exports = class UpdateInventory {
  static async update(salesArray) {
    await Sale.insert(salesArray);
    return Promise.all(
      salesArray.sales.map(async (sale) => { //loops through an array of sales
        const menu = await Menu.getAll();
        const inventory = await Inventory.getAll();
        const mealName = menu.find((name) => name.meal_name === sale.name); //gets the ingredients that go with a sale
        let i = 0;
        while (mealName.ingredients[i]) { //loops through the ingredients of a sale
          const parsedIngredient = JSON.parse(mealName.ingredients[i]);
          const parsedName = parsedIngredient.name;
          const reduction = parsedIngredient.quantity * sale.quantity; //gets the total amount of an ingredient used in a sale
          const inventoryItems = inventory.find( //finds the ingredient that was used
            (item) => item.item_name === parsedName
          );
          await Inventory.updateById(inventoryItems.id, { //reduces the inventory
            total_on_hand: inventoryItems.total_on_hand - reduction,
          });
          i++;
        }
      })
    );
  }
  static async textOnUpdate(phoneNumber) {
    await sendText(
      phoneNumber,
      'Inventory has been updated to reflect recent sales data, check your Bienventory app to see most recent inventory'
    );
  }
};
