import { invoke } from '@tauri-apps/api/core';

export interface DatabaseResult {
  success: boolean;
  message: string;
  path?: string;
}

export class DatabaseService {
  /**
   * Create a new database at the specified path
   */
  static async createDatabase(dbPath: string): Promise<DatabaseResult> {
    try {
      const message = await invoke<string>('create_database', { dbPath });
      return {
        success: true,
        message,
        path: dbPath
      };
    } catch (error) {
      return {
        success: false,
        message: error as string
      };
    }
  }

  /**
   * Validate an existing database at the specified path
   */
  static async validateDatabase(dbPath: string): Promise<DatabaseResult> {
    try {
      const message = await invoke<string>('validate_database', { dbPath });
      return {
        success: true,
        message,
        path: dbPath
      };
    } catch (error) {
      return {
        success: false,
        message: error as string
      };
    }
  }

  /**
   * Get the app data directory path
   */
  static async getAppDataDir(): Promise<string> {
    try {
      return await invoke<string>('get_app_data_dir');
    } catch (error) {
      throw new Error(`Failed to get app data directory: ${error}`);
    }
  }

  /**
   * Create or validate a database based on path
   * If the file exists, validates it; if not, creates it
   */
  static async connectToDatabase(dbPath: string): Promise<DatabaseResult> {
    // Check if file exists by trying to validate first
    const validateResult = await this.validateDatabase(dbPath);

    if (validateResult.success) {
      return validateResult;
    }

    // If validation failed, try to create it
    const createResult = await this.createDatabase(dbPath);

    if (createResult.success) {
      return createResult;
    }

    return {
      success: false,
      message: `Failed to connect to database: ${createResult.message}`
    };
  }
}
