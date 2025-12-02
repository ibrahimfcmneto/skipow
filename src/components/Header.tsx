import { ReactNode } from 'react';

interface HeaderProps {
  title: string;
  rightContent?: ReactNode;
}

export function Header({ title, rightContent }: HeaderProps) {
  return (
    <header className="bg-header text-header-foreground px-4 py-4 sticky top-0 z-40 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold">{title}</h1>
        {rightContent}
      </div>
    </header>
  );
}
