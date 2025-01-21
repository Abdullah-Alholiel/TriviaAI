from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database.session import get_db
from database.models.user import UserModel
import bcrypt

app = FastAPI()

@app.post("/users/check")
async def check_credentials(
    email: str,
    password: str,
    db: Session = Depends(get_db)
):
    user = db.query(UserModel).filter(UserModel.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    valid = bcrypt.checkpw(
        password.encode('utf-8'),
        user.hashed_password.encode('utf-8')
    )
    
    if not valid:
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    return {
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role
        }
    }

@app.post("/users/create")
def create_user(email: str, username: str, password: str, db: Session = Depends(get_db)):
    hashed_pass = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    user = UserModel(username=username, email=email, hashed_password=hashed_pass)
    db.add(user)
    db.commit()
    return {"success": True}

@app.post("/users/oauth")
async def create_oauth_user(
    email: str,
    username: str,
    oauth_provider: str,
    oauth_id: str,
    db: Session = Depends(get_db)
):
    existing_user = db.query(UserModel).filter(
        (UserModel.email == email) | 
        (UserModel.oauth_id == oauth_id)
    ).first()
    
    if existing_user:
        return {"success": True, "user": existing_user}
        
    new_user = UserModel(
        email=email,
        username=username,
        oauth_provider=oauth_provider,
        oauth_id=oauth_id,
        role="user"
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {
        "success": True,
        "user": {
            "id": new_user.id,
            "username": new_user.username,
            "email": new_user.email,
            "role": new_user.role
        }
    }