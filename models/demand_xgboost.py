import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler, LabelEncoder
import xgboost as xgb
import matplotlib.pyplot as plt

data = pd.read_csv('./data/retail_store_inventory.csv')

# Feature Engineering
# Extract date features
data['Date'] = pd.to_datetime(data['Date'])
data['Year'] = data['Date'].dt.year
data['Month'] = data['Date'].dt.month
data['Day'] = data['Date'].dt.day
data['DayOfWeek'] = data['Date'].dt.dayofweek
data['WeekOfYear'] = data['Date'].dt.isocalendar().week

# Encoding categorical features
label_encoders = {}
categorical_cols = ['Category', 'Inventory Level', 'Weather Condition', 'Holiday/Promotion', 'Seasonality']
for col in categorical_cols:
    le = LabelEncoder()
    data[col] = le.fit_transform(data[col])
    label_encoders[col] = le

# Lag features
data['Lag_1'] = data['Units Sold'].shift(1)
data['Lag_2'] = data['Units Sold'].shift(2)
data['Lag_3'] = data['Units Sold'].shift(3)
data['Lag_7'] = data['Units Sold'].shift(7)
data['Lag_14'] = data['Units Sold'].shift(14)

# Fill NA values resulting from lag features
data.fillna(0, inplace=True)

# Features and target
features = data[['Year', 'Month', 'Day', 'DayOfWeek', 'WeekOfYear', 'Category', 'Inventory Level', 'Weather Condition', 'Holiday/Promotion', 'Seasonality', 'Price', 'Discount', 'Lag_1', 'Lag_2', 'Lag_3', 'Lag_7', 'Lag_14']]
target = data['Units Sold']

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(features, target, test_size=0.2, random_state=42, shuffle=False)

# Scaling the features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# XGBoost model
xgb_model = xgb.XGBRegressor(objective='reg:squarederror', eval_metric='rmse')

# Grid Search for hyperparameter tuning
param_grid = {
    'n_estimators': [100, 200, 300],
    'max_depth': [3, 5, 7],
    'learning_rate': [0.01, 0.1, 0.2],
    'subsample': [0.8, 1.0],
    'colsample_bytree': [0.8, 1.0]
}

grid_search = GridSearchCV(estimator=xgb_model, param_grid=param_grid, cv=3, scoring='neg_mean_squared_error', verbose=2, n_jobs=-1)
grid_search.fit(X_train_scaled, y_train)

best_model = grid_search.best_estimator_

# Predictions
y_pred = best_model.predict(X_test_scaled)

# Plotting
plt.figure(figsize=(10, 6))
plt.plot(y_test.values, label='Actual Units Sold')
plt.plot(y_pred, label='Predicted Units Sold', color='orange')
plt.title('Units Sold Prediction')
plt.legend()
plt.savefig("Plot-xgboost");
plt.close()

print(f"Best Parameters: {grid_search.best_params_}")
