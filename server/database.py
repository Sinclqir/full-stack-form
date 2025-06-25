import os
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

def get_connection():
    """Obtient une connexion à la base de données MySQL"""
    try:
        # Gérer le cas où MYSQL_PORT est vide ou None
        port_str = os.getenv("MYSQL_PORT", "3306")
        port = int(port_str) if port_str and port_str.strip() else 3306
        
        connection = mysql.connector.connect(
            host=os.getenv("MYSQL_HOST", "localhost"),
            database=os.getenv("MYSQL_DATABASE", "user_management"),
            user=os.getenv("MYSQL_USER", "root"),
            password=os.getenv("MYSQL_PASSWORD", ""),
            port=port
        )
        return connection
    except Error as e:
        print(f"Erreur de connexion à MySQL: {e}")
        raise

def init_database():
    """Initialise la base de données avec la table users"""
    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        # Vérifier si la table users existe déjà
        cursor.execute("SHOW TABLES LIKE 'users'")
        table_exists = cursor.fetchone()
        
        if not table_exists:
            # Créer la table users seulement si elle n'existe pas
            create_table_query = """
            CREATE TABLE users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                last_name VARCHAR(255) NOT NULL,
                first_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                birth_date DATE,
                city VARCHAR(255),
                postal_code VARCHAR(10),
                role ENUM('user', 'admin') DEFAULT 'user',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_email (email),
                INDEX idx_role (role),
                INDEX idx_created_at (created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """
            
            cursor.execute(create_table_query)
            conn.commit()
            print("Table 'users' créée avec succès")
        else:
            print("Table 'users' existe déjà, pas de modification nécessaire")
        
    except Error as e:
        print(f"Erreur lors de l'initialisation de la base de données: {e}")
        raise
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

def test_connection():
    """Teste la connexion à la base de données"""
    try:
        conn = get_connection()
        if conn.is_connected():
            db_info = conn.get_server_info()
            print(f"Connecté à MySQL Server version {db_info}")
            cursor = conn.cursor()
            cursor.execute("select database();")
            record = cursor.fetchone()
            print(f"Connecté à la base de données: {record[0]}")
            return True
    except Error as e:
        print(f"Erreur lors de la connexion à MySQL: {e}")
        return False
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

def create_admin_user():
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
        
        # Importer la fonction de hashage depuis auth
        from auth import hash_password
        
        # Créer l'admin
        hashed_password = hash_password(admin_password)
        sql = """
            INSERT INTO users (last_name, first_name, email, password_hash, birth_date, city, postal_code, role, created_at) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NOW())
        """
        values = ("Fenoll", "Loïse", admin_email, hashed_password, "1990-01-01", "Admin City", "00000", "admin")
        cursor.execute(sql, values)
        conn.commit()
        
        print(f"Admin créé avec succès: {admin_email}")
        
    except Error as err:
        print(f"Erreur lors de la création de l'admin: {err}")
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()
