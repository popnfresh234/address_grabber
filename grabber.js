require('dotenv').config();
const fetch = require('node-fetch');

const getCustomers = (cursor, customers) => {
  let url = 'https://connect.squareup.com/v2/customers';
  if (cursor) url = `${url}?cursor=${cursor}`;

  return fetch(url, {
    method: 'GET',
    headers: {
      'square-version': '2020-04-22',
      authorization: process.env.TOKEN,
      'content-type': 'application/json',
    },
  }).then(response => response.json())
    .then((result) => {
      if (result.cursor) return getCustomers(result.cursor, customers.concat(result.customers));
      return customers;
    });
};

const sortCountry = (countryCode, postal) => {
  // Sort by country code first
  const lookup = { CA: 'Canada', US: 'United States' };
  let country = lookup[countryCode] ? lookup[countryCode] : countryCode;

  // double check via postal code
  const us = new RegExp('^\\d{5}(-{0,1}\\d{4})?$');
  const ca = new RegExp(/^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]( )?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i);
  if (us.test(postal)) country = 'United States';
  if (ca.test(postal)) country = 'Canada';
  return country;
};

const getLatLng = customers => customers
  .filter(customer => customer.address)
  .map((addressedCustomer) => {
    const { address } = addressedCustomer;
    const country = sortCountry(address.country, address.postal_code);
    return `${address.address_line_1}, ${address.locality}, ${address.postal_code}, ${country}`;
  });

getCustomers(null, []).then((customers) => {
  const latLngArr = getLatLng(customers);
  console.log(latLngArr);
});

