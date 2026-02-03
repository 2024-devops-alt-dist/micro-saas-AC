import React from 'react'

interface GridItemProps {
  children: React.ReactNode;
  className?: string;
}

function GridItem({ children, className }: GridItemProps) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

export default GridItem