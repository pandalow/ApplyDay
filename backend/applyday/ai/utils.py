# backend/applyday/ai/utils.py
import logging
import time
from functools import wraps
from typing import Any, Callable

logger = logging.getLogger(__name__)

def retry_on_timeout(max_retries: int = 3, delay: float = 1.0):
    """
    The code is modified by Claude in vibe coding.
    Decorator to retry AI API calls on timeout or connection errors
    Prevents transient network issues from causing failures in AI calls
    with exponential backoff.
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs) -> Any:
            last_exception = None
            
            for attempt in range(max_retries):
                try:
                    return func(*args, **kwargs)
                    
                except Exception as e:
                    last_exception = e
                    error_msg = str(e).lower()
                    
                    # Check if it's a retriable error
                    if any(keyword in error_msg for keyword in [
                        'timeout', 'connection', 'network', 'read timeout',
                        'ssl', 'httpcore', 'httpx'
                    ]):
                        if attempt < max_retries - 1:
                            wait_time = delay * (2 ** attempt)  # Exponential backoff
                            logger.warning(
                                f"AI API call failed (attempt {attempt + 1}/{max_retries}): {e}. "
                                f"Retrying in {wait_time} seconds..."
                            )
                            time.sleep(wait_time)
                            continue
                    
                    # Non-retriable error or max retries reached
                    logger.error(f"AI API call failed after {attempt + 1} attempts: {e}")
                    raise e
            
            # This should never be reached, but just in case
            if last_exception:
                raise last_exception
            else:
                raise Exception("All retry attempts failed")
            
        return wrapper
    return decorator


def log_ai_performance(func: Callable) -> Callable:
    """
    Decorator to log AI API call performance
    """
    @wraps(func)
    def wrapper(*args, **kwargs) -> Any:
        start_time = time.time()
        try:
            result = func(*args, **kwargs)
            duration = time.time() - start_time
            logger.info(f"AI API call '{func.__name__}' completed in {duration:.2f}s")
            return result
        except Exception as e:
            duration = time.time() - start_time
            logger.error(f"AI API call '{func.__name__}' failed after {duration:.2f}s: {e}")
            raise e
    return wrapper
