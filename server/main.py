import os
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
import mysql.connector
from datetime import datetime

from models import UserCreate, UserLogin, UserResponse, Token, MessageResponse, LoginResponse
from auth import (
    create_user, 
    verify_password, 
    create_jwt_token, 
    get_current_user, 
    get_current_admin,
    create_default_admin
)
from database import get_connection, init_database, test_connection

# Charger les variables d'environnement
from dotenv import load_dotenv
load_dotenv()

# Créer l'application FastAPI
app = FastAPI(
    title="User Management API",
    description="API de gestion des utilisateurs avec authentification JWT",
    version="1.0.0"
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:4173",
        "https://sinclqir.github.io",
        "https://*.github.io",  # Tous les sous-domaines GitHub Pages
        "https://full-stack-form-server.vercel.app",
        "https://*.vercel.app",  # Tous les sous-domaines Vercel
        "*"  # Temporaire pour debug - à retirer en production
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
    allow_headers=[
        "Accept",
        "Accept-Language",
        "Content-Language",
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Origin",
        "Access-Control-Request-Method",
        "Access-Control-Request-Headers"
    ],
    expose_headers=["*"],
    max_age=86400,  # Cache preflight pour 24h
)

# Événement de démarrage
@app.on_event("startup")
async def startup_event():
    """Initialise la base de données et crée l'admin par défaut au démarrage"""
    try:
        print("Initialisation de la base de données...")
        init_database()
        
        print("Test de connexion à la base de données...")
        if test_connection():
            print("Connexion à la base de données réussie")
        else:
            print("Échec de la connexion à la base de données")
        
        print("Création de l'utilisateur admin par défaut...")
        create_default_admin()
        
    except Exception as e:
        print(f"Erreur lors du démarrage: {e}")

# Routes d'authentification
@app.post("/register", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate):
    """Enregistre un nouvel utilisateur"""
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Vérifier si l'email existe déjà
        cursor.execute("SELECT id FROM users WHERE email = %s", (user_data.email,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Email déjà utilisé")
        
        # Hasher le mot de passe
        from auth import hash_password
        hashed_password = hash_password(user_data.password)
        
        # Insérer le nouvel utilisateur
        sql = """
            INSERT INTO users (last_name, first_name, email, password_hash, birth_date, city, postal_code, role, created_at) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        values = (
            user_data.last_name,
            user_data.first_name,
            user_data.email,
            hashed_password,
            user_data.birth_date,
            user_data.city,
            user_data.postal_code,
            user_data.role,
            datetime.utcnow()
        )
        cursor.execute(sql, values)
        conn.commit()
        
        print(f"Utilisateur créé avec succès: {user_data.email}")
        return MessageResponse(message=f"Utilisateur créé avec succès: {user_data.email}")
        
    except mysql.connector.Error as err:
        print(f"Erreur MySQL lors de l'inscription: {err}")
        raise HTTPException(status_code=500, detail=str(err))
    except Exception as e:
        print(f"Erreur générale lors de l'inscription: {e}")
        raise HTTPException(status_code=500, detail="Erreur interne du serveur")
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()

@app.post("/login", response_model=LoginResponse)
async def login(user_data: UserLogin):
    """Connecte un utilisateur et retourne un token JWT avec les infos utilisateur"""
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Récupérer l'utilisateur par email
        cursor.execute("SELECT * FROM users WHERE email = %s", (user_data.email,))
        user = cursor.fetchone()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email ou mot de passe incorrect"
            )
        
        # Vérifier le mot de passe
        if not verify_password(user_data.password, user['password_hash']):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email ou mot de passe incorrect"
            )
        
        # Créer le token JWT
        token_data = {
            "user_id": user['id'],
            "email": user['email'],
            "role": user['role']
        }
        access_token = create_jwt_token(token_data)
        
        # Préparer les données utilisateur à retourner (sans le mot de passe)
        user_info = {
            "id": user['id'],
            "email": user['email'],
            "role": user['role'],
            "first_name": user['first_name'],
            "last_name": user['last_name'],
            "created_at": user['created_at'].isoformat() if user['created_at'] else None
        }
        
        return LoginResponse(
            access_token=access_token, 
            token_type="bearer",
            user=user_info
        )
        
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err))
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

# Routes protégées
@app.get("/users", response_model=list[UserResponse])
async def get_users(current_admin: dict = Depends(get_current_admin)):
    """Récupère tous les utilisateurs (admin seulement)"""
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("SELECT id, last_name, first_name, email, birth_date, city, postal_code, role, created_at FROM users ORDER BY created_at DESC")
        users = cursor.fetchall()
        
        # Convertir les dates en chaînes de caractères
        for user in users:
            if user['birth_date']:
                user['birth_date'] = user['birth_date'].isoformat()
            if user['created_at']:
                user['created_at'] = user['created_at'].isoformat()
        
        return users
        
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err))
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.get("/public-users")
async def get_public_users():
    """Récupère la liste publique des utilisateurs (nom, prénom, email seulement)"""
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("SELECT first_name, last_name, email FROM users ORDER BY first_name")
        users = cursor.fetchall()
        
        return users
        
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err))
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.get("/users/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Récupère les informations de l'utilisateur connecté"""
    return {
        "id": current_user['id'],
        "email": current_user['email'],
        "role": current_user['role'],
        "created_at": current_user['created_at']
    }

@app.delete("/users/{user_id}", response_model=MessageResponse)
async def delete_user(user_id: int, current_admin: dict = Depends(get_current_admin)):
    """Supprime un utilisateur (admin seulement)"""
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Vérifier si l'utilisateur existe
        cursor.execute("SELECT id FROM users WHERE id = %s", (user_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
        
        # Supprimer l'utilisateur
        cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
        conn.commit()
        
        return MessageResponse(message=f"Utilisateur {user_id} supprimé avec succès")
        
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=str(err))
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

# Route de santé
@app.get("/", response_model=MessageResponse)
async def root():
    """Route racine pour vérifier que l'API fonctionne"""
    return MessageResponse(message="User Management API is running")

@app.get("/health", response_model=MessageResponse)
async def health_check():
    """Vérification de la santé de l'API"""
    try:
        if test_connection():
            return MessageResponse(message="API is healthy and database is connected")
        else:
            raise HTTPException(status_code=503, detail="Database connection failed")
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Health check failed: {str(e)}")

# Route de test CORS
@app.get("/cors-test")
async def cors_test():
    """Route de test pour vérifier la configuration CORS"""
    return {
        "message": "CORS test successful",
        "timestamp": datetime.utcnow().isoformat(),
        "allowed_origins": [
            "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:4173",
            "https://sinclqir.github.io",
            "https://*.github.io",
            "https://full-stack-form-server.vercel.app",
            "https://*.vercel.app"
        ]
    }

# Route OPTIONS pour gérer les requêtes preflight
@app.options("/{full_path:path}")
async def options_handler(full_path: str):
    """Gère les requêtes OPTIONS pour CORS"""
    return {"message": "OK"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
