
from flask import Flask, request, jsonify 
import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from sklearn.preprocessing import MinMaxScaler
from stable_baselines3.common.vec_env import DummyVecEnv
from gymnasium import Env
from gymnasium.spaces import Discrete, Box
from flask_cors import CORS
from statsmodels.tsa.arima.model import ARIMA
import json  # Import the json module
from stable_baselines3 import PPO, A2C, DDPG
from stable_baselines3.common.vec_env import DummyVecEnv
import logging
import traceback
# from gym import Env
# from gym.spaces import Box

app = Flask(__name__)
CORS(app)  # Enable CORS

@app.route('/forecast', methods=['POST'])
def forecast():
    try:
        # Parse input data
        data = request.json
        stock_symbol = data.get('stock_symbol')
        
        if not stock_symbol:
            return jsonify({'error': 'Stock symbol is required'}), 400
        
        # Fetch stock data
        time_range = '3y'  # Renamed from 'range' to 'time_range'
        stock_data = yf.Ticker(stock_symbol).history(period=time_range)
        
        if stock_data.empty or 'Close' not in stock_data.columns:
            return jsonify({'error': 'Invalid stock symbol or no data available'}), 400
        
        # Prepare data for ARIMA
        stock_data['Date'] = stock_data.index
        stock_data['Date'] = pd.to_datetime(stock_data['Date'])
        stock_data['Close'] = stock_data['Close'].ffill()  # Updated to use ffill()
        
        # Scale data
        scaler = MinMaxScaler(feature_range=(0, 1))
        scaled_data = scaler.fit_transform(stock_data['Close'].values.reshape(-1, 1))
        
        # Fit ARIMA model
        model = ARIMA(scaled_data, order=(5, 1, 0))
        model_fit = model.fit()
        
        # Forecast
        forecast_steps = 15
        forecast_scaled = model_fit.forecast(steps=forecast_steps)
        forecast = scaler.inverse_transform(forecast_scaled.reshape(-1, 1))
        
        # Generate forecast dates
        last_date = stock_data['Date'].max()
        if isinstance(last_date, str):  # Ensure last_date is a datetime object
            last_date = pd.to_datetime(last_date)
        forecast_dates = [(last_date + timedelta(days=i)).strftime('%Y-%m-%d') for i in range(1, forecast_steps + 1)]
        
        # Prepare response
        forecast_data = {
            'dates': forecast_dates,
            'prices': forecast.flatten().tolist()
        }
        
        return jsonify(forecast_data)
    
    except json.JSONDecodeError:
        return jsonify({'error': 'Failed to decode JSON response from Yahoo Finance API'}), 500
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500

@app.route('/historic', methods=['GET'])
def historic():
    symbol = request.args.get('symbol')
    range = request.args.get('range', '1mo')
    
    if not symbol:
        return jsonify({'error': 'Stock symbol is required'}), 400
    
    # Adjusting range for compatibility
    if range == '1wk':
        range = '5d'
    
    # Fetch stock data
    try:
        stock_data = yf.Ticker(symbol).history(period=range)
        print(stock_data)
        if stock_data.empty:
            return jsonify({'error': 'Invalid stock symbol or no data available'}), 400
        
        # Debugging data structure
        print(stock_data.head())
        print(stock_data.columns)
        
        # Check if 'Close' column exists
        if 'Close' not in stock_data.columns:
            return jsonify({'error': "'Close' column not found in stock data"}), 500
        
        # Cleaning and preparing data
        stock_data.reset_index(inplace=True)  # Reset index to make 'Date' a column
        stock_data['Date'] = pd.to_datetime(stock_data['Date'], errors='coerce')  # Ensure valid dates
        stock_data['Close'] = stock_data['Close'].fillna(method='ffill')  # Fill missing close prices
        
        # Ensure essential columns are free of NaN
        if stock_data[['Date', 'Close']].isnull().any().any():
            return jsonify({'error': 'Insufficient data to process'}), 400
        
        # Extract data as lists
        dates = stock_data['Date'].dt.strftime('%Y-%m-%d').values.tolist()  # Format dates
        prices = stock_data['Close'].values.tolist()  # Convert close prices to list
        
        # Structuring response
        historic_data = {
            'dates': dates,
            'prices': prices
        }
        
        return jsonify(historic_data)
    
    except json.JSONDecodeError:
        return jsonify({'error': 'Failed to decode JSON response from Yahoo Finance API'}), 500
    except Exception as e:
        return jsonify({'error': f'Failed to fetch data: {str(e)}'}), 500

def fetch_stock_data(stock_symbols):
    """
    Fetches stock data for the given symbols from Yahoo Finance.

    Args:
        stock_symbols (iterable): List of stock symbols to fetch data for.

    Returns:
        pd.DataFrame: A combined DataFrame with stock symbols as columns.
    """
    stock_data = {}
    try:
        for symbol in stock_symbols:
            # Fetch historical data for the last 1 month
            data = yf.download(symbol, period='1mo', interval='1d')
            if data.empty:  # Check if the data is empty
                raise ValueError(f"No data found for symbol: {symbol}")
            stock_data[symbol] = data['Close']  # Use 'Close' prices

        # Combine all data into a single DataFrame
        combined_data = pd.concat(stock_data.values(), axis=1, keys=stock_data.keys())

        # Handle missing values
        if combined_data.isnull().values.any():
            combined_data = combined_data.ffill().bfill()  # Forward-fill and backward-fill

        return combined_data

    except Exception as e:
        raise ValueError(f"Failed to fetch stock data: {str(e)}")
class MultiAgentStockTradingEnv(Env):
    def __init__(self, stock_data, portfolio, transaction_fee=0.001):
        super().__init__()
        self.stock_data = stock_data
        self.portfolio = portfolio.copy()
        self.transaction_fee = transaction_fee
        self.current_step = 0
        self.initial_portfolio = portfolio.copy()  # Critical fix

        # Observation space: Stock prices + Portfolio holdings + Total portfolio value
        num_stocks = len(stock_data.columns)
        self.observation_space = Box(
            low=0,
            high=np.inf,
            shape=(num_stocks * 4 + 1,),  # 4 features per stock + total value
            dtype=np.float32
        )
        
        # Action space: Continuous actions for each stock (values between 0 and 1)
        self.action_space = Box(
            low=0,
            high=1,
            shape=(num_stocks,),
            dtype=np.float32
        )

    def step(self, actions):
        rewards = {}
        done = False
        truncated = False
        
        for i, stock in enumerate(self.portfolio.keys()):
            action = actions[i]
            price = self.stock_data[stock].iloc[self.current_step].item()  # Scalar
            
            if action > 0.5:  # Paper's action threshold (Section IV.C.4)
                quantity = self.portfolio[stock] * action
                transaction_cost = price * quantity * self.transaction_fee
                rewards[stock] = (price * quantity) - transaction_cost
                self.portfolio[stock] -= quantity
            else:
                rewards[stock] = 0

        self.current_step += 1
        if self.current_step >= len(self.stock_data) - 5:  # 5-day window
            done = True

        return self._get_states(), sum(rewards.values()), done, truncated, {}

    def reset(self, seed=None, options=None):
        super().reset(seed=seed)
        self.current_step = 0
        self.portfolio = self.initial_portfolio.copy()
        return self._get_states(), {}

    def _get_states(self):
        """Implements paper's state representation (Section IV.C.1) with scalar conversion"""
        state = []
        total_value = 0
        
        for stock in self.portfolio.keys():
            # Convert all values to scalars using .iloc[0].item()
            price = self.stock_data[stock].iloc[self.current_step].item()
            holding = float(self.portfolio[stock])
            
            # Calculate technical indicators as scalars
            ma5 = self.stock_data[stock].iloc[
                max(0, self.current_step-5):self.current_step+1
            ].mean().item()  # Convert to scalar
            
            ma20 = self.stock_data[stock].iloc[
                max(0, self.current_step-20):self.current_step+1
            ].mean().item()  # Convert to scalar

            # Add scalar values to state (Paper Eq. 3)
            state.extend([
                np.float32(price),
                np.float32(holding),
                np.float32(0 if np.isnan(ma5) else ma5),
                np.float32(0 if np.isnan(ma20) else ma20)
            ])
            
            total_value += price * holding
            
        # Add portfolio-level feature (Section IV.C.1)
        state.append(np.float32(total_value))
        
        # Ensure 1D array matching observation space
        return np.array(state, dtype=np.float32).reshape(-1)


@app.route('/recommendations', methods=['POST'])
def recommend_stocks():
    try:
        data = request.json
        portfolio = data.get('portfolio', {})
        
        # Paper's data validation (Section IV.A)
        if not portfolio or len(portfolio) == 0:
            raise ValueError("Empty portfolio provided")
            
        stock_data = fetch_stock_data(portfolio.keys())
        
        # Paper's preprocessing requirements
        stock_data = stock_data.interpolate(method='time').ffill().bfill()
        
        env = DummyVecEnv([lambda: MultiAgentStockTradingEnv(stock_data, portfolio)])
        
        # Paper's ensemble architecture (Section IV.C.4)
        models = {
            'conservative': PPO('MlpPolicy', env, device='cpu',
                              learning_rate=0.0003, n_steps=1024),
            'moderate': A2C('MlpPolicy', env, device='cpu',
                          learning_rate=0.0005, n_steps=512),
            'aggressive': DDPG('MlpPolicy', env, device='cpu',
                             learning_rate=0.001, buffer_size=10000)
        }
        
        recommendations = []
        def calculate_quantity(agent_type, action_value, portfolio):
            """Implements paper's dynamic selling strategy (Section IV.C.4)"""
            if agent_type == 'aggressive':
                return round(action_value * portfolio[stock], 2)  # Continuous
            elif agent_type == 'moderate':
                return round(portfolio[stock] * 0.35, 2) if action_value > 0.5 else 0
            else:  # conservative
                return round(portfolio[stock] * 0.2, 2) if action_value > 0.7 else 0
        # Paper's training methodology (Section IV.C.4)
        for agent_name, model in models.items():
            print(f"Training {agent_name} agent...")
            model.learn(total_timesteps=150)
            obs = env.reset()
            
            for day in range(5):
                actions, _ = model.predict(obs)
                for i, stock in enumerate(portfolio):
                    rec = {
                        'day': day+1,
                        'stock': stock,
                        'action': 'sell' if actions[0][i] > 0.5 else 'hold',
                        'confidence': float(actions[0][i]),
                        'agent': agent_name,
                        'quantity': calculate_quantity(agent_name, actions[0][i],portfolio)
                    }
                    recommendations.append(rec)
                obs, _, _, _ = env.step(actions)
        
        return jsonify(recommendations)
        
    except Exception as e:
        logging.error(f"Error: {str(e)}\n{traceback.format_exc()}")
        return jsonify({
            'error': 'System error',
            'message': 'Please try again later'
        }), 500


if __name__ == '__main__':
    app.run(debug=True)