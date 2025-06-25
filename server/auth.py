import os
import jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import mysql.connector
from database import get_connection

# Configuration pour le hashage des mots de passe
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Configuration JWT
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Sécurité HTTP Bearer
security = HTTPBearer()

def hash_password(password: str) -> str:
    """Hash un mot de passe avec bcrypt"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Vérifie un mot de passe contre son hash"""
    return pwd_context.verify(plain_password, hashed_password)

def create_jwt_token(data: dict) -> str:
    """Crée un token JWT"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_jwt_token(token: str) -> dict:
    """Vérifie et décode un token JWT"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expiré")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Token invalide")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Récupère l'utilisateur actuel à partir du token JWT"""
    token = credentials.credentials
    payload = verify_jwt_token(token)
    
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("SELECT * FROM users WHERE id = %s", (payload.get("user_id"),))
        user = cursor.fetchone()
        
        if not user:
            raise HTTPException(status_code=401, detail="Utilisateur non trouvé")
        
        return user
        
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err))
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

async def get_current_admin(current_user: dict = Depends(get_current_user)) -> dict:
    """Vérifie que l'utilisateur actuel est un admin"""
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Accès refusé - Admin requis")
    return current_user

def create_user(email: str, password: str, role: str = "user") -> dict:
    """Crée un nouvel utilisateur"""
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Vérifier si l'email existe déjà
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Email déjà utilisé")
        
        # Hasher le mot de passe
        hashed_password = hash_password(password)
        
        # Insérer le nouvel utilisateur
        sql = """
            INSERT INTO users (email, password_hash, role, created_at) 
            VALUES (%s, %s, %s, %s)
        """
        values = (email, hashed_password, role, datetime.utcnow())
        cursor.execute(sql, values)
        conn.commit()
        
        # Récupérer l'utilisateur créé
        user_id = cursor.lastrowid
        cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        
        return user
        
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err))
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

def create_default_admin():
    """Crée l'utilisateur admin par défaut depuis les variables d'environnement"""
    admin_email = os.getenv("ADMIN_EMAIL")
    admin_password = os.getenv("ADMIN_PASSWORD")
    
    if not admin_email or not admin_password:
        print("Variables d'environnement ADMIN_EMAIL et ADMIN_PASSWORD requises")
        return
    
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Vérifier si l'admin existe déjà
        cursor.execute("SELECT id FROM users WHERE email = %s", (admin_email,))
        if cursor.fetchone():
            print(f"Admin avec l'email {admin_email} existe déjà")
            return
        
        # Créer l'admin avec tous les champs requis
        hashed_password = hash_password(admin_password)
        sql = """
            INSERT INTO users (last_name, first_name, email, password_hash, birth_date, city, postal_code, role, created_at) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        values = (
            "Admin",  # last_name
            "System",  # first_name
            admin_email,
            hashed_password,
            "1990-01-01",  # birth_date par défaut
            "Paris",  # city par défaut
            "75000",  # postal_code par défaut
            "admin",
            datetime.utcnow()
        )
        cursor.execute(sql, values)
        conn.commit()
        
        print(f"Admin créé avec succès: {admin_email}")
        
    except mysql.connector.Error as err:
        print(f"Erreur lors de la création de l'admin: {err}")
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()
