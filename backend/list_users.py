from database import SessionLocal
import models

db = SessionLocal()
users = db.query(models.User).all()

for user in users:
    print(f"ID: {user.id} | Nom: {user.name} | Email: {user.email} | Role: {user.role}")

db.close()