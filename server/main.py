from flask import Flask, request, jsonify 
import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from stable_baselines3 import PPO
from stable_baselines3.common.vec_env import DummyVecEnv
from gym import Env
from gym.spaces import Discrete, Box

app = Flask(__name__)

@app.route('/forecast', methods=['POST'])
def forecast():
    data = request.json
    stock_symbol = data.get('stock_symbol')
    
    if not stock_symbol:
        return jsonify({'error': 'Stock symbol is required'}), 400
    
    stock_data = yf.download(stock_symbol, period='1y', interval='1d')
    
    if stock_data.empty:
        return jsonify({'error': 'Invalid stock symbol or no data available'}), 400
    
    # Prepare data for LSTM
    stock_data['Date'] = stock_data.index
    stock_data['Date'] = pd.to_datetime(stock_data['Date'])
    stock_data['Close'] = stock_data['Close'].fillna(method='ffill')
    
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(stock_data['Close'].values.reshape(-1, 1))
    
    # Create training data
    def create_dataset(data, time_step=1):
        X, Y = [], []
        for i in range(len(data) - time_step - 1):
            a = data[i:(i + time_step), 0]
            X.append(a)
            Y.append(data[i + time_step, 0])
        return np.array(X), np.array(Y)
    
    time_step = 60
    X, Y = create_dataset(scaled_data, time_step)
    X = X.reshape(X.shape[0], X.shape[1], 1)
    
    # Train LSTM model
    model = Sequential()
    model.add(LSTM(50, return_sequences=True, input_shape=(time_step, 1)))
    model.add(LSTM(50, return_sequences=False))
    model.add(Dense(25))
    model.add(Dense(1))
    
    model.compile(optimizer='adam', loss='mean_squared_error')
    model.fit(X, Y, batch_size=1, epochs=1)
    
    # Forecast next 15 days
    last_60_days = scaled_data[-60:]
    forecast_input = last_60_days.reshape(1, -1)
    temp_input = list(forecast_input)
    temp_input = temp_input[0].tolist()
    
    lst_output = []
    n_steps = 60
    i = 0
    while i < 15:
        if len(temp_input) > 60:
            forecast_input = np.array(temp_input[1:])
            forecast_input = forecast_input.reshape(1, -1)
            forecast_input = forecast_input.reshape((1, n_steps, 1))
            yhat = model.predict(forecast_input, verbose=0)
            temp_input.extend(yhat[0].tolist())
            temp_input = temp_input[1:]
            lst_output.extend(yhat.tolist())
            i += 1
        else:
            forecast_input = forecast_input.reshape((1, n_steps, 1))
            yhat = model.predict(forecast_input, verbose=0)
            temp_input.extend(yhat[0].tolist())
            lst_output.extend(yhat.tolist())
            i += 1
    
    forecasted_prices = scaler.inverse_transform(lst_output)
    
    forecast_dates = [stock_data['Date'].max() + timedelta(days=i) for i in range(1, 16)]
    forecast_data = {
        'dates': [date.strftime('%Y-%m-%d') for date in forecast_dates],
        'prices': forecasted_prices.flatten().tolist()
    }
    
    return jsonify(forecast_data)

# --- Reinforcement Learning Route for Stock Recommendations --- 
class StockTradingEnv(Env):
    def __init__(self, stock_data, portfolio):
        super(StockTradingEnv, self).__init__()
        self.stock_data = stock_data
        self.portfolio = portfolio
        
        # Action space: 0 for Hold, 1 for Sell
        self.action_space = Discrete(2)
        
        # Observation space: Stock prices + Portfolio holdings
        self.observation_space = Box(low=0, high=np.inf, shape=(len(stock_data.columns) + len(portfolio),))
        
        self.current_step = 0
    
    def step(self, action):
        done = False
        reward = 0
        
        # Take action (sell or hold)
        for stock in self.portfolio:
            price = self.stock_data[stock][self.current_step]
            if action == 1:  # Sell action
                reward += price * self.portfolio[stock]
                self.portfolio[stock] = 0  # Sell all shares
        
        # Update to next day
        self.current_step += 1
        if self.current_step >= len(self.stock_data) or all(v == 0 for v in self.portfolio.values()):
            done = True  # Episode ends if all stocks are sold or time limit is reached
        
        # Get next state (stock prices and remaining portfolio)
        state = np.array([self.stock_data[stock][self.current_step] for stock in self.portfolio])
        state = np.append(state, list(self.portfolio.values()))
        
        return state, reward, done, {}

    def reset(self):
        self.current_step = 0
        state = np.array([self.stock_data[stock][self.current_step] for stock in self.portfolio])
        state = np.append(state, list(self.portfolio.values()))
        return state

@app.route('/recommendations', methods=['POST'])
def recommend_stocks():
    data = request.json
    portfolio = data.get('portfolio')
    
    if not portfolio:
        return jsonify({'error': 'Portfolio is required'}), 400
    
    # Fetch stock data for the stocks in the portfolio
    stock_data = fetch_stock_data(portfolio.keys())
    
    # Create the stock trading environment
    env = DummyVecEnv([lambda: StockTradingEnv(stock_data, portfolio)])
    
    # Train a PPO agent to maximize portfolio value
    model = PPO('MlpPolicy', env, verbose=1)
    model.learn(total_timesteps=10000)
    
    # Make sell/hold recommendations for the next 7 days
    obs = env.reset()
    recommendations = []
    
    for day in range(7):
        action, _states = model.predict(obs)
        obs, rewards, dones, info = env.step(action)
        
        action_label = "sell" if action[0] == 1 else "hold"
        recommendations.append({"day": day + 1, "action": action_label})

        if action_label == "sell":
            # Optionally decide how much to sell
            # For example, sell 20% of the current holdings
            for stock in portfolio:
                quantity_to_sell = portfolio[stock] * 0.2  # Adjust percentage as needed
                recommendations[-1].update({"stock": stock, "quantity": quantity_to_sell})
    
    return jsonify(recommendations)

def fetch_stock_data(stock_symbols):
    stock_data = {}
    for symbol in stock_symbols:
        stock_data[symbol] = yf.download(symbol, period='1mo', interval='1d')['Close'].values
    return pd.DataFrame(stock_data)

if __name__ == '__main__':
    app.run(debug=True)
