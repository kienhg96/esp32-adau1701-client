/**
 * Error codes
 */
enum ErrorCode {
    SUCCESS,
    BUFFER_OVERFLOW,
    BUFFER_UNDERFLOW
};

export function makeError(error: ErrorCode): Error {
    switch (error) {
        case ErrorCode.SUCCESS:
            return new Error("SUCCESS");
        case ErrorCode.BUFFER_OVERFLOW:
            return new Error("BUFFER_OVERFLOW");
        case ErrorCode.BUFFER_UNDERFLOW:
            return new Error("BUFFER_UNDERFLOW");
    }
}

export default ErrorCode;
