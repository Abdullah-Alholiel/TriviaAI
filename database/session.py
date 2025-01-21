import bcrypt
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .models import Base

SQLALCHEMY_DATABASE_URL = "postgresql://triviaAi_owner:7BasZUfO9cvC@ep-orange-star-a9z5pxy2.gwc.azure.neon.tech/triviaAi?sslmode=require"

engine = create_engine(SQLALCHEMY_DATABASE_URL, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

def init_db():
    Base.metadata.create_all(bind=engine)
    from .models.user import UserModel
    db = SessionLocal()
    
    # Create superadmin if none exists
    if not db.query(UserModel).filter(UserModel.role == "superadmin").first():
        password = "admin123"  # Change this in production
        hashed_password = bcrypt.hashpw(
            password.encode('utf-8'), 
            bcrypt.gensalt()
        ).decode('utf-8')
        
        superadmin = UserModel(
            username="admin",
            email="admin@example.com",
            hashed_password=hashed_password,
            role="superadmin"
        )
        db.add(superadmin)
        db.commit()