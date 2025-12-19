use std::fs;
use std::path::Path;
use rusqlite::{Connection, Result as SqlResult};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn create_database(db_path: String) -> Result<String, String> {
    // Ensure the directory exists
    if let Some(parent) = Path::new(&db_path).parent() {
        fs::create_dir_all(parent).map_err(|e| format!("Failed to create directory: {}", e))?;
    }

    // Create and initialize the database
    let conn = Connection::open(&db_path)
        .map_err(|e| format!("Failed to create database: {}", e))?;

    // Create basic tables (can be expanded later)
    conn.execute(
        "CREATE TABLE IF NOT EXISTS metadata (
            key TEXT PRIMARY KEY,
            value TEXT
        )",
        [],
    ).map_err(|e| format!("Failed to create metadata table: {}", e))?;

    // Insert version info
    conn.execute(
        "INSERT OR REPLACE INTO metadata (key, value) VALUES ('version', '1.0.0')",
        [],
    ).map_err(|e| format!("Failed to set version: {}", e))?;

    Ok(format!("Database created successfully at: {}", db_path))
}

#[tauri::command]
async fn validate_database(db_path: String) -> Result<String, String> {
    if !Path::new(&db_path).exists() {
        return Err("Database file does not exist".to_string());
    }

    let conn = Connection::open(&db_path)
        .map_err(|e| format!("Failed to open database: {}", e))?;

    // Check if our metadata table exists
    let mut stmt = conn.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='metadata'")
        .map_err(|e| format!("Failed to check database structure: {}", e))?;

    let exists = stmt.exists([])
        .map_err(|e| format!("Failed to verify database: {}", e))?;

    if !exists {
        return Err("Database exists but is not a valid Provision Reserve database".to_string());
    }

    Ok(format!("Valid Provision Reserve database found at: {}", db_path))
}

#[tauri::command]
async fn get_app_data_dir() -> Result<String, String> {
    let app_data_dir = dirs::data_dir()
        .ok_or("Could not determine app data directory")?
        .join("Provision Reserve");

    fs::create_dir_all(&app_data_dir)
        .map_err(|e| format!("Failed to create app data directory: {}", e))?;

    Ok(app_data_dir.to_string_lossy().to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            create_database,
            validate_database,
            get_app_data_dir
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
