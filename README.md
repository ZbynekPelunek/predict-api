# Predict

This is my solution for '/predict' API endpoint.

On **POST** /'predict' it accepts 2 parameters:

*params* (optional)

**data** (required)

- Parameter **data** must contain at least 2 objects with parameters *timestamp* (**date**) and *value* (**number**)

*params* parameter is used to change the default behaviour, it accepts only 'days', that changes the predict value by number of days from last date, default is 30 days.

Example:

`
"params": [{"name": "days","value": 60}], "data": [ ... ]
`

Prediction takes into account values of last X days, count a difference between them and adds the average of the differences to the last value.

## Table of contents

- [Installation](#installation)
- [Technologies](#technologies)
- [Framework](#framework)
- [Status](#status)

## Installation

Initialize git in your folder of choise with

```bash
git init
```

Then clone this repository

```bash
git clone https://github.com/zbynekpelunek/predict-api
```

Install all needed node modules

```bash
npm i
```

Finally, start the server

```bash
npm start
```

Using Postman or similar software, you can now access Predict API on localhost

`
localhost:3000/predict
`

### Technologies

- Javascript
- Typescript

### Framework

- Express.JS

### Status

 Task is: _complete_
