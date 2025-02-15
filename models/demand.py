import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from keras.models import Sequential
from keras.layers import Conv1D, MaxPooling1D, Flatten, Dense, LSTM, Dropout
from keras.callbacks import EarlyStopping
from keras.regularizers import l2

# Load dataset
data = pd.read_csv('./data/retail_store_inventory.csv')

# Extract date features
data['Date'] = pd.to_datetime(data['Date'])
data['Year'] = data['Date'].dt.year
data['Month'] = data['Date'].dt.month
data['Day'] = data['Date'].dt.day
data.drop(columns=['Date'], inplace=True)

# Encode categorical variables
categorical_cols = ['Category', 'Weather Condition', 'Holiday/Promotion', 'Seasonality']
data = pd.get_dummies(data, columns=categorical_cols)

# Select features and targets
features = data.drop(columns=['Units Sold', 'Units Ordered'])
features = features.drop(columns=['Store ID', 'Product ID', 'Region'])
target_units_sold = data['Units Sold']
target_units_ordered = data['Units Ordered']

# Normalize features and targets
scaler_features = MinMaxScaler()
scaler_units_sold = MinMaxScaler()
scaler_units_ordered = MinMaxScaler()

features_scaled = scaler_features.fit_transform(features)
target_units_sold_scaled = scaler_units_sold.fit_transform(target_units_sold.values.reshape(-1, 1))
target_units_ordered_scaled = scaler_units_ordered.fit_transform(target_units_ordered.values.reshape(-1, 1))

# Create sequences with timesteps
def create_sequences(features, target, time_steps=3):
    X, y = [], []
    for i in range(len(features) - time_steps):
        X.append(features[i:i + time_steps])
        y.append(target[i + time_steps])
    return np.array(X), np.array(y)

X_units_sold, y_units_sold = create_sequences(features_scaled, target_units_sold_scaled)
X_units_ordered, y_units_ordered = create_sequences(features_scaled, target_units_ordered_scaled)

# Split data into training and testing sets
train_size = int(len(X_units_sold) * 0.8)
X_train_sold, X_test_sold = X_units_sold[:train_size], X_units_sold[train_size:]
y_train_sold, y_test_sold = y_units_sold[:train_size], y_units_sold[train_size:]

X_train_ordered, X_test_ordered = X_units_ordered[:train_size], X_units_ordered[train_size:]
y_train_ordered, y_test_ordered = y_units_ordered[:train_size], y_units_ordered[train_size:]

# Build hybrid CNN + LSTM model
model = Sequential()
model.add(Conv1D(filters=64, kernel_size=2, activation='relu', input_shape=(X_train_sold.shape[1], X_train_sold.shape[2])))
model.add(MaxPooling1D(pool_size=2))
model.add(LSTM(100, return_sequences=True))  # Add LSTM layer
model.add(LSTM(50))  # Add another LSTM layer
model.add(Dense(50, activation='relu', kernel_regularizer=l2(0.01)))
model.add(Dropout(0.2))  # Add dropout layer
model.add(Dense(1))

model.compile(optimizer='adam', loss='mse')

# Train the model
early_stopping = EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)
history = model.fit(X_train_sold, y_train_sold, epochs=50, batch_size=64, validation_split=0.2, callbacks=[early_stopping])

# Evaluate the model
y_pred_sold = model.predict(X_test_sold)
y_pred_sold = scaler_units_sold.inverse_transform(y_pred_sold)
y_test_sold = scaler_units_sold.inverse_transform(y_test_sold)

# Plot results
plt.figure(figsize=(10, 6))
plt.plot(y_test_sold, label='Actual Units Sold')
plt.plot(y_pred_sold, label='Predicted Units Sold')
plt.legend()
plt.title('Units Sold Prediction')
plt.savefig("plot.png")  # Saves the plot as a PNG file
plt.close()  # Close the plot to free up memory

# Metrics
print('R2 Score:', r2_score(y_test_sold, y_pred_sold))
print('Mean Squared Error:', mean_squared_error(y_test_sold, y_pred_sold))
print('Mean Absolute Error:', mean_absolute_error(y_test_sold, y_pred_sold))