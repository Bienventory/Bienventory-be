DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS menus CASCADE;
DROP TABLE IF EXISTS inventory_menus CASCADE;
DROP TABLE IF EXISTS sales CASCADE;

CREATE TABLE users(
    google_id TEXT NOT NULL UNIQUE,
    notifications BOOLEAN NOT NULL,
    phone_number TEXT
);

CREATE TABLE inventory(
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id TEXT REFERENCES users(google_id),
    item_name TEXT NOT NULL,
    description TEXT NOT NULL,
    total_on_hand DECIMAL NOT NULL,
    par INTEGER NOT NULL,
    unit_type TEXT NOT NULL
);

CREATE TABLE menus(
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id TEXT REFERENCES users(google_id),
    meal_name TEXT NOT NULL unique,
    ingredients TEXT [] NOT NULL -- Perhaps this should be a junction table instead?
);

-- Something like:
-- CREATE TABLE menu_ingredients (
--     inventory_id BIGINT,
--     menu_id BIGINT,
--     quantity DECIMAL,
--     FOREIGN KEY (inventory_id) REFERENCES inventory(id),
--     FOREIGN KEY (menu_id) REFERENCES menus(id),
-- )
-- And any other fields you need to track which ingredients go into each menu item

CREATE TABLE inventory_menus(
    inventory_id BIGINT REFERENCES inventory(id),
    menus_id BIGINT REFERENCES menus(id)
);

CREATE TABLE sales(
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id TEXT REFERENCES users(google_id),
    sales TEXT [] -- Instead of an array, how else might you handle sales data?
);
