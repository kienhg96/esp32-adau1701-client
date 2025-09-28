/**
 * Error codes
 */
enum ErrorCode {
    SUCCESS,
    BUFFER_OVERFLOW,
    BUFFER_UNDERFLOW,
    RESOURCE_NULL,
    UPGRADE_FAILED
};

export function makeError(error: ErrorCode): Error {
    switch (error) {
        case ErrorCode.SUCCESS:
            return new Error("SUCCESS");
        case ErrorCode.BUFFER_OVERFLOW:
            return new Error("BUFFER_OVERFLOW");
        case ErrorCode.BUFFER_UNDERFLOW:
            return new Error("BUFFER_UNDERFLOW");
        case ErrorCode.RESOURCE_NULL:
            return new Error("RESOURCE_NULL");
        case ErrorCode.UPGRADE_FAILED:
            return new Error("UPGRADE_FAILED");
    }
}

export default ErrorCode;
