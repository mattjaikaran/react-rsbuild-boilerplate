import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Image } from './image'

describe('Image', () => {
  it('resets an exhausted fallback when the source changes', () => {
    const { rerender } = render(
      <Image
        src="/first.png"
        alt="Project"
        fallbackSrc="/backup.png"
        fallback={<span>Unavailable</span>}
      />,
    )
    fireEvent.error(screen.getByRole('img', { name: 'Project' }))
    expect(screen.getByRole('img', { name: 'Project' })).toHaveAttribute('src', '/backup.png')
    fireEvent.error(screen.getByRole('img', { name: 'Project' }))
    expect(screen.getByText('Unavailable')).toBeInTheDocument()
    rerender(
      <Image
        src="/second.png"
        alt="Project"
        fallbackSrc="/backup.png"
        fallback={<span>Unavailable</span>}
      />,
    )
    expect(screen.queryByText('Unavailable')).not.toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Project' })).toHaveAttribute('src', '/second.png')
  })
})
