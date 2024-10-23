# Stock Market App

A comprehensive stock market application built using Next.js, Express, and Firebase. This application allows users to manage their stock portfolio, get real-time stock data, forecast stock prices, and receive stock recommendations.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Frontend Pages](#frontend-pages)

## Features

- **User Authentication**: Secure user authentication using Firebase.
- **Portfolio Management**: Add, view, and manage your stock portfolio.
- **Real-Time Data**: Get real-time stock data for your portfolio.
- **Stock Forecasting**: Forecast stock prices using machine learning models.
- **Stock Recommendations**: Receive stock recommendations based on your portfolio.
- **Historical Data**: View historical stock data for different time ranges.

## Technologies Used

- **Frontend**: Next.js, React, Chart.js
- **Backend**: Express, Flask
- **Database**: Firebase Firestore
- **Machine Learning**: TensorFlow, Stable Baselines3
- **APIs**: Yahoo Finance (yfinance)

## Installation

### Prerequisites

- Node.js and npm installed
- Python and pip installed
- Firebase account and project set up

### Frontend

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/stock-market-app.git
   cd stock-market-app/frontend
   ```
2. Install dependencies:
   ```bash
    npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Backend

1. Navigate to the backend directory:
   ```bash
   cd stock-market-app/backend
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the Flask server:
   ```bash
   python app.py
   ```

### Firebase

    1. Set up Firebase Firestore and Authentication.
    2. Update the Firebase configuration in the frontend.

## Usage

### Adding Stocks to Portfolio

1. Navigate to the portfolio page.
2. Click on "Add Stock".
3. Enter the stock symbol and quantity.
4. Click "Add".

### Viewing Real-Time Data

1. Navigate to the real-time data page.
2. View the current prices of stocks in your portfolio.

### Forecasting Stock Prices

1. Navigate to the forecast page.
2. Select a stock from your portfolio.
3. Click "Forecast" to view the forecasted prices.

### Getting Stock Recommendations

1. Navigate to the recommendations page.
2. Click "Get Recommendations" to view the recommended actions for your portfolio.

### Viewing Historical Data

1. Navigate to the historical data page.
2. Select a stock and a time range.
3. Click "Fetch Data" to view the historical prices.

## API Endpoints

### Flask Endpoints

- /forecast: POST - Forecast stock prices.
- /recommendations: POST - Get stock recommendations.
- /historic: GET - Get historical stock data.

### Express Endpoints

- /api/stock: GET - Get real-time stock data.

## Frontend Pages

### Authentication/Signup Page

users can sign up for an account or log in using their name, email and password and get authenticated using Firebase.

![Signin Page](/image/1.png)

![Signup Page](/image/2.png)

### Portfolio Page

Manage your stock portfolio by adding, viewing, and managing your stocks.

![Portfolio Page](/image/3.png)

![Add Stock Page](/image/4.png)

![Stock Details Page](/image/5.png)

### Real-Time Data Page

View the current prices of stocks in your portfolio in real-time.

![Real-Time Data Page](/image/6.png)

### Forecast Page

Forecast stock prices using machine learning models.

![Forecast Page](/image/7.png)

![Forecast Results Page](/image/8.png)

### Recommendations Page

Receive stock recommendations based on your portfolio.

![Recommendations Page](/image/9.png)

### Historical Data Page

View historical stock data for different time ranges.

![Historical Data Page](/image/10.png)

![Historical Data Result Page](/image/11.png)
