-- Create a database
CREATE DATABASE property_portfolio;

-- Create a table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR (200) NOT NULL,
    hashed_password VARCHAR (200) NOT NULL
);

-- Insert data into a table
INSERT INTO users(user_email, hashed_password)
VALUES ('kurtisgarcia14@gmail.com', 'password123');

-- Create a table
CREATE TABLE properties (
    id serial PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    street VARCHAR (200) NOT NULL,
    city VARCHAR (200) NOT NULL,
    state VARCHAR (200) NOT NULL,
    zip VARCHAR (200) NOT NULL,
    mortgage_amount INT NOT NULL,
    vacancy VARCHAR (200) NOT NULL,
    renter_name VARCHAR (200) NOT NULL,
    renter_number VARCHAR (200) NOT NULL,
    renter_email VARCHAR (200) NOT NULL,
    lease_term VARCHAR (200) NOT NULL,
    rent_amount INT NOT NULL,
    rent_status VARCHAR (200) NOT NULL,
    property_image VARCHAR (200) NOT NULL
);

-- Insert data into a table
INSERT INTO properties(user_id, street, city, state, zip, mortgage_amount, vacancy, renter_name, renter_number, renter_email, lease_term, rent_amount, rent_status, property_image)
VALUES (1, '14 Forrest Hills Dr', 'Atlanta', 'Ga', '30362', 2200, 'Occupied', 'John & Laura', '465-887-2304', 'John@gmail.com', '6/20/23 - 6/20/25', 3000, 'Past Due', 'image path');

