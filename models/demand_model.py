from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from typing import Optional
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
from xgboost import XGBRegressor
import joblib
import os
import io

app = FastAPI()

DATA_DIR = "user_data"
MODEL_FILE = "demand_forecast_model.pkl"
HISTORICAL_DATA_FILE = "historical_data.csv"

os.makedirs(DATA_DIR, exist_ok=True)

class FeedbackData(BaseModel):
    user_id: int
    date: str
    demand: float
    feature1: Optional[float] = None
    feature2: Optional[float] = None

def load_data(user_id):
    user_dir = os.path.join(DATA_DIR, f"user_{user_id}")
    historical_data_path = os.path.join(user_dir, HISTORICAL_DATA_FILE)
    if os.path.exists(historical_data_path):
        return pd.read_csv(historical_data_path)
    else:
        raise FileNotFoundError(f"No historical data found for user {user_id}.")

def preprocess_data(df):
    df['date'] = pd.to_datetime(df['date'])
    df['month'] = df['date'].dt.month
    df['day'] = df['date'].dt.day
    df['weekday'] = df['date'].dt.weekday

    df = df.drop(columns=['date'])
    df = df.fillna(df.mean())

    X = df.drop(columns=['demand'])
    y = df['demand']
    return X, y

def train_model(X, y):
    model = XGBRegressor(objective='reg:squarederror', n_estimators=100, learning_rate=0.1)
    model.fit(X, y)
    return model

def save_model(model, user_id):
    user_dir = os.path.join(DATA_DIR, f"user_{user_id}")
    model_path = os.path.join(user_dir, MODEL_FILE)
    joblib.dump(model, model_path)

def load_model(user_id):
    user_dir = os.path.join(DATA_DIR, f"user_{user_id}")
    model_path = os.path.join(user_dir, MODEL_FILE)
    if os.path.exists(model_path):
        return joblib.load(model_path)
    else:
        raise FileNotFoundError(f"No model found for user {user_id}.")

def update_feedback_data(user_id, new_data):
    user_dir = os.path.join(DATA_DIR, f"user_{user_id}")
    historical_data_path = os.path.join(user_dir, HISTORICAL_DATA_FILE)

    historical_data = pd.read_csv(historical_data_path)
    new_data_df = pd.DataFrame([new_data])
    updated_data = pd.concat([historical_data, new_data_df], ignore_index=True)

    updated_data.to_csv(historical_data_path, index=False)

def continuous_learning(user_id, new_data):
    update_feedback_data(user_id, new_data)
    df = load_data(user_id)
    X, y = preprocess_data(df)
    model = train_model(X, y)
    save_model(model, user_id)

@app.post("/register_user")
async def register_user(user_id: int = Form(...), file: UploadFile = File(...)):
    user_dir = os.path.join(DATA_DIR, f"user_{user_id}")
    os.makedirs(user_dir, exist_ok=True)
    historical_data_path = os.path.join(user_dir, HISTORICAL_DATA_FILE)

    content = await file.read()
    df = pd.read_csv(io.StringIO(content.decode('utf-8')))
    df.to_csv(historical_data_path, index=False)

    X, y = preprocess_data(df)
    model = train_model(X, y)
    save_model(model, user_id)

    return {"message": f"User {user_id} registered and model trained successfully."}

@app.post("/provide_feedback")
async def provide_feedback(feedback: FeedbackData):
    new_data = feedback.dict()
    new_data['feature1'] = new_data['feature1'] if new_data['feature1'] is not None else np.nan
    new_data['feature2'] = new_data['feature2'] if new_data['feature2'] is not None else np.nan

    continuous_learning(feedback.user_id, new_data)
    return {"message": f"Feedback received and model updated for user {feedback.user_id}."}

@app.get("/predict")
async def predict(user_id: int, date: str, feature1: float, feature2: float):
    try:
        model = load_model(user_id)
        date_parsed = pd.to_datetime(date)

        input_data = pd.DataFrame({
            'month': [date_parsed.month],
            'day': [date_parsed.day],
            'weekday': [date_parsed.weekday()],
            'feature1': [feature1],
            'feature2': [feature2]
        })

        prediction = model.predict(input_data)[0]
        return {"predicted_demand": prediction}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
