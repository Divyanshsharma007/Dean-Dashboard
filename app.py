from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib

app = FastAPI(title="Student Dropout Prediction API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained model
model = joblib.load("catboost_full_model.pkl")

print("=" * 60)
print("MODEL TYPE:")
print(type(model))

print("\nFEATURES:")
print(model.feature_names_)
print("=" * 60)


class StudentData(BaseModel):
    age: int
    gender: str
    nationality: str
    highschool_score: float
    entrance_exam_score_normalized: float
    department: int
    admission_type: str
    attendance_pct: float
    current_sem_cgpa: float
    aggregate_cgpa: float
    backlogs_count: int
    family_income_bracket: str
    parent_education: str
    scholarship_status: str
    fee_payment_status: str
    residence_type: str
    commute_distance_km: float


FEATURE_ORDER = [
    "age",
    "gender",
    "nationality",
    "highschool_score",
    "entrance_exam_score_normalized",
    "department",
    "admission_type",
    "attendance_pct",
    "current_sem_cgpa",
    "aggregate_cgpa",
    "backlogs_count",
    "family_income_bracket",
    "parent_education",
    "scholarship_status",
    "fee_payment_status",
    "residence_type",
    "commute_distance_km",
    "department_missing",
    "admission_type_missing",
    "backlogs_count_missing",
    "scholarship_status_missing",
    "fee_payment_status_missing",
    "residence_type_missing",
    "family_income_bracket_missing",
    "commute_distance_km_missing"
]


@app.get("/")
def home():
    return {
        "message": "Student Dropout Prediction API Running"
    }


@app.post("/predict")
def predict(data: StudentData):

    try:

        df = pd.DataFrame([data.model_dump()])

        # Missing indicator columns used during training
        df["department_missing"] = 0
        df["admission_type_missing"] = 0
        df["backlogs_count_missing"] = 0
        df["scholarship_status_missing"] = 0
        df["fee_payment_status_missing"] = 0
        df["residence_type_missing"] = 0
        df["family_income_bracket_missing"] = 0
        df["commute_distance_km_missing"] = 0

        # Match training order
        df = df[FEATURE_ORDER]

        print("\n" + "=" * 60)
        print("INPUT TO MODEL")
        print(df)
        print("=" * 60)

        prediction = model.predict(df)[0]

        probabilities = model.predict_proba(df)[0]

        return {
            "prediction": str(prediction),
            "dropout_probability": float(probabilities[0]),
            "not_dropout_probability": float(probabilities[1])
        }

    except Exception as e:

        print("\nMODEL ERROR:")
        print(str(e))

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )