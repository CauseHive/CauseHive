# CauseHive PostgreSQL Local Setup Guide

## Prerequisites

1. **Install PostgreSQL** (if not already installed):
   - Download from: https://www.postgresql.org/download/windows/
   - Or install via Chocolatey: `choco install postgresql`
   - Or install via Scoop: `scoop install postgresql`

2. **Install Python packages**:
   ```bash
   cd backend/services/user_service
   pip install -r requirements.txt
   ```

## Quick Setup (Automated)

### Option 1: PowerShell Script (Recommended)
```powershell
# Run as Administrator
cd scripts
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\setup-postgres-local.ps1
```

### Option 2: Manual Setup

1. **Create PostgreSQL Database**:
   ```sql
   -- Connect to PostgreSQL as postgres user
   psql -U postgres
   
   -- Create database
   CREATE DATABASE causehive_db;
   
   -- Create user (optional)
   CREATE USER causehive_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE causehive_db TO causehive_user;
   
   -- Exit
   \q
   ```

2. **Configure Environment Variables**:
   ```bash
   cd backend/services/user_service
   copy .env.example .env
   ```
   
   Edit `.env` file with your database settings:
   ```env
   SECRET_KEY=your-secret-key-here
   DEBUG=True
   
   DB_NAME=causehive_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_SSLMODE=prefer
   ```

3. **Run Django Setup**:
   ```bash
   cd backend/services/user_service
   
   # Setup database and migrations
   python manage.py setup_db --sample-data
   
   # Or manually:
   python manage.py makemigrations
   python manage.py migrate
   python manage.py createsuperuser
   
   # Start Django server
   python manage.py runserver
   ```

## Database Management Commands

### Using Custom Management Command
```bash
# Full setup with sample data
python manage.py setup_db --sample-data

# Reset database
python manage.py setup_db --reset

# Just setup without sample data
python manage.py setup_db
```

### Standard Django Commands
```bash
# Make migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver

# Django shell
python manage.py shell
```

## Testing Database Connection

```python
# In Django shell (python manage.py shell)
from django.db import connection
with connection.cursor() as cursor:
    cursor.execute("SELECT version();")
    print(cursor.fetchone())
```

## Default Credentials

After running `setup_db` command:
- **Admin User**: admin@causehive.com / admin123
- **Sample Donor**: donor1@example.com / password123
- **Sample Organizer**: organizer1@example.com / password123

## Troubleshooting

### Common Issues:

1. **Connection Refused**:
   - Ensure PostgreSQL service is running
   - Check if PostgreSQL is listening on port 5432
   - Verify firewall settings

2. **Authentication Failed**:
   - Check username/password in `.env`
   - Ensure user has proper permissions
   - Try connecting with `psql` directly

3. **Database Does Not Exist**:
   - Run the setup script or create database manually
   - Check database name in `.env`

4. **SSL Issues**:
   - For local development, set `DB_SSLMODE=prefer` or `disable`
   - For production, use `DB_SSLMODE=require`

### PostgreSQL Service Commands (Windows):

```powershell
# Start PostgreSQL service
net start postgresql-x64-14  # or your version

# Stop PostgreSQL service
net stop postgresql-x64-14

# Check service status
Get-Service postgresql*
```

## Production Notes

For production deployment:
- Use strong passwords
- Set `DEBUG=False`
- Use `DB_SSLMODE=require`
- Configure proper backup strategy
- Set up connection pooling if needed
