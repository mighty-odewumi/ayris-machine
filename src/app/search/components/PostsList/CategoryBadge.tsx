import React from 'react';

interface CategoryBadgeProps {
  name: string;
}

export default function CategoryBadge({ name }: CategoryBadgeProps) {
  return (
    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
      {name}
    </span>
  );
}