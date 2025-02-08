export const TASK_NOT_FOUND = 'task/not_found' as const;
export const TASK_CREATION_FAILED = 'task/creation_failed' as const;
export const TASK_UPDATE_FAILED = 'task/update_failed' as const;
export const TASK_DELETION_FAILED = 'task/deletion_failed' as const;
export const TASK_COMPLETION_FAILED = 'task/completion_failed' as const;
export const TASK_FETCH_FAILED = 'task/fetch_failed' as const;
export const TASK_STATUS_CALCULATION_FAILED = 'task/status_calculation_failed' as const;


/**
 * Invalid Task ID provided
*/
export const TASK_INVALID_ID = 'task/invalid_id' as const;

/**
 * Task due date is invalid
*/
export const TASK_INVALID_DUE_DATE = 'task/invalid_due_date' as const;

/**
 * Task title is too short
*/
export const TASK_TITLE_TOO_SHORT = 'task/title_too_short' as const;

/**
 * Task description exceeds the allowed limit
*/
export const TASK_DESCRIPTION_TOO_LONG = 'task/description_too_long' as const;

/**
 * Unauthorized access to task
*/
export const TASK_UNAUTHORIZED_ACCESS = 'task/unauthorized_access' as const;

/**
 * Task already marked as completed
*/
export const TASK_ALREADY_COMPLETED = 'task/already_completed' as const;

/**
 * General error in the task service
*/
export const TASK_SERVICE_ERROR = 'task/service_error' as const;

/**
 * Database connection issue while handling task operations
*/
export const TASK_DB_CONNECTION_FAILED = 'task/db_connection_failed' as const;

/**
 * Search keyword is required for search
*/
export const KEYWORD_IS_REQUIRED = 'search/keyword is required for search' as const;