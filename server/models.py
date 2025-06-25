from pydantic import BaseModel, EmailStr
from datetime import datetime, date
from typing import Optional

class UserBase(BaseModel):
    """Modèle de base pour les utilisateurs"""
    email: EmailStr

class UserCreate(BaseModel):
    """Modèle pour la création d'un utilisateur"""
    last_name: str
    first_name: str
    email: EmailStr
    password: str
    birth_date: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    role: str = "user"

class UserLogin(BaseModel):
    """Modèle pour la connexion d'un utilisateur"""
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    """Modèle de réponse pour les utilisateurs"""
    id: int
    last_name: str
    first_name: str
    email: str
    birth_date: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    role: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserInDB(UserResponse):
    """Modèle pour les utilisateurs en base de données (avec mot de passe hashé)"""
    password_hash: str

class Token(BaseModel):
    """Modèle pour les tokens JWT"""
    access_token: str
    token_type: str

class TokenData(BaseModel):
    """Modèle pour les données du token"""
    user_id: Optional[int] = None
    email: Optional[str] = None

class UserUpdate(BaseModel):
    """Modèle pour la mise à jour d'un utilisateur"""
    last_name: Optional[str] = None
    first_name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    birth_date: Optional[date] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    role: Optional[str] = None

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: dict

class MessageResponse(BaseModel):
    """Modèle pour les réponses de message"""
    message: str
