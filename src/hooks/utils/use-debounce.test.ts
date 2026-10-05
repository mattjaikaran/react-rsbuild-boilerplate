import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useDebounceWithLoading } from './use-debounce'

afterEach(() => vi.useRealTimers())

describe('useDebounceWithLoading', () => {
  it('settles the latest value and cancels the previous timer', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(({ value }) => useDebounceWithLoading(value, 100), {
      initialProps: { value: 'first' },
    })
    rerender({ value: 'second' })
    act(() => vi.advanceTimersByTime(50))
    rerender({ value: 'third' })
    act(() => vi.advanceTimersByTime(50))
    expect(result.current).toEqual({ debouncedValue: 'first', isDebouncing: true })
    act(() => vi.advanceTimersByTime(50))
    expect(result.current).toEqual({ debouncedValue: 'third', isDebouncing: false })
  })
})
