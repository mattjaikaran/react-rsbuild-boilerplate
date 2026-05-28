import { useCallback, useEffect, useReducer, useRef } from 'react'

type DebounceState<T> = { debouncedValue: T }
function debounceReducer<T>(_state: DebounceState<T>, action: { value: T }): DebounceState<T> {
  return { debouncedValue: action.value }
}

export const useDebounce = <T>(value: T, delay: number = 500): T => {
  const [state, dispatch] = useReducer(debounceReducer<T>, { debouncedValue: value })

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ value })
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return state.debouncedValue
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useDebouncedCallback = <T extends (...args: any[]) => unknown>(
  callback: T,
  delay: number = 500
): ((...args: Parameters<T>) => void) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args)
      }, delay)
    },
    [callback, delay]
  )

  useEffect(() => {
    const ref = timeoutRef
    return () => {
      if (ref.current) {
        clearTimeout(ref.current)
      }
    }
  }, [])

  return debouncedCallback
}

type DebounceLoadingState<T> = { debouncedValue: T; isDebouncing: boolean }
type DebounceLoadingAction<T> =
  | { type: 'start' }
  | { type: 'settle'; value: T }

function debounceLoadingReducer<T>(
  state: DebounceLoadingState<T>,
  action: DebounceLoadingAction<T>
): DebounceLoadingState<T> {
  if (action.type === 'start') return { ...state, isDebouncing: true }
  return { debouncedValue: action.value, isDebouncing: false }
}

export const useDebounceWithLoading = <T>(
  value: T,
  delay: number = 500
): { debouncedValue: T; isDebouncing: boolean } => {
  const [state, dispatch] = useReducer(debounceLoadingReducer<T>, {
    debouncedValue: value,
    isDebouncing: false,
  })

  const valueRef = useRef(value)
  valueRef.current = value

  useEffect(() => {
    dispatch({ type: 'start' })
    const timer = setTimeout(() => {
      dispatch({ type: 'settle', value: valueRef.current })
    }, delay)
    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return state
}
