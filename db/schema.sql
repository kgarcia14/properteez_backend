-- Create a database
CREATE DATABASE property_portfolio;

-- Create a table for users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR (200) UNIQUE NOT NULL,
    hashed_password VARCHAR (200) NOT NULL
);

-- Insert data into a table
INSERT INTO users(user_email, hashed_password)
VALUES ('kurtisgarcia14@gmail.com', 'password123');

-- Create a table for properties
CREATE TABLE properties (
    id serial PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    street VARCHAR (200) NOT NULL,
    city VARCHAR (200) NOT NULL,
    state VARCHAR (200) NOT NULL,
    zip VARCHAR (200) NOT NULL,
    home_type VARCHAR (200) NOT NULL,
    mortgage_amount VARCHAR (200) NOT NULL,
    vacancy VARCHAR (200) NOT NULL,
    renter_name VARCHAR (200) NOT NULL,
    renter_number VARCHAR (200) NOT NULL,
    renter_email VARCHAR (200) NOT NULL,
    lease_start VARCHAR (200) NOT NULL,
    lease_end VARCHAR (200) NOT NULL,
    rent_amount VARCHAR (200) NOT NULL,
    rent_status VARCHAR (200) NOT NULL,
    property_image VARCHAR (200) NOT NULL
);


-- Insert data into a table
INSERT INTO properties(user_id, street, city, state, zip, home_type, mortgage_amount, vacancy, renter_name, renter_number, renter_email, lease_start, lease_end, rent_amount, rent_status, property_image) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *, [data.user_id, data.street, data.city, data.state, data.zip, data.home_type, data.mortgage_amount, data.vacancy, data.renter_name, data.renter_number, data.renter_email, data.lease_start, data.lease_end, data.rent_amount, data.rent_status, imageUrl];

CREATE TABLE tasks (
    id serial PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    location VARCHAR (200) NOT NULL,
    title VARCHAR (200) NOT NULL,
    description VARCHAR (200) NOT NULL,
    status VARCHAR (200) NOT NULL,
    complete BOOLEAN NOT NULL
);

INSERT INTO tasks(user_id, location, title, description, status, complete) VALUES($1, $2, $3, $4, $5, $6) RETURNING *, ['29', '48 Timberland Way', 'Collect Rent', 'Need to collect rent from every property', 'urgent', false];

