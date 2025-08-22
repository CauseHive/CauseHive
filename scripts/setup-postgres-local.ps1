# CauseHive PostgreSQL Local Setup Script
# Run this script as Administrator in PowerShell

Write-Host "🚀 Setting up PostgreSQL for CauseHive..." -ForegroundColor Cyan

# Check if PostgreSQL is installed
$pgPath = Get-Command psql -ErrorAction SilentlyContinue
if (-not $pgPath) {
    Write-Host "❌ PostgreSQL not found. Please install PostgreSQL first." -ForegroundColor Red
    Write-Host "Download from: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    Write-Host "Or install via Chocolatey: choco install postgresql" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ PostgreSQL found at: $($pgPath.Source)" -ForegroundColor Green

# Database configuration
$DB_NAME = "causehive_db"
$DB_USER = "postgres"
$DB_PASSWORD = "password"

Write-Host "📦 Creating database: $DB_NAME..." -ForegroundColor Yellow

# Create database
$env:PGPASSWORD = $DB_PASSWORD
try {
    # Check if database exists
    $dbExists = & psql -h localhost -U $DB_USER -lqt | Select-String -Pattern $DB_NAME
    
    if ($dbExists) {
        Write-Host "⚠️  Database '$DB_NAME' already exists." -ForegroundColor Yellow
        $response = Read-Host "Do you want to recreate it? (y/N)"
        if ($response -eq "y" -or $response -eq "Y") {
            & dropdb -h localhost -U $DB_USER $DB_NAME
            Write-Host "🗑️  Dropped existing database." -ForegroundColor Yellow
        } else {
            Write-Host "✅ Using existing database." -ForegroundColor Green
            exit 0
        }
    }
    
    # Create new database
    & createdb -h localhost -U $DB_USER $DB_NAME
    Write-Host "✅ Database '$DB_NAME' created successfully!" -ForegroundColor Green
    
    # Test connection
    $testQuery = "SELECT version();"
    $result = & psql -h localhost -U $DB_USER -d $DB_NAME -c $testQuery
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database connection test successful!" -ForegroundColor Green
    } else {
        Write-Host "❌ Database connection test failed." -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ Error creating database: $_" -ForegroundColor Red
    exit 1
} finally {
    Remove-Item env:PGPASSWORD -ErrorAction SilentlyContinue
}

Write-Host "`n🎉 PostgreSQL setup complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Copy .env.example to .env in the backend/services/user_service/ directory" -ForegroundColor White
Write-Host "2. Update the .env file with your settings" -ForegroundColor White
Write-Host "3. Run Django migrations: python manage.py migrate" -ForegroundColor White
Write-Host "4. Create a superuser: python manage.py createsuperuser" -ForegroundColor White
