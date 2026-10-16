import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon, ArrowRight } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionLink?: string;
  onActionClick?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  actionLink,
  onActionClick
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 max-w-md mx-auto rounded-3xl glass-card border border-surface-border my-8">
      <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-5 shadow-glow-sm">
        <Icon className="w-10 h-10" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed mb-6">{description}</p>
      
      {actionText && actionLink && (
        <Link
          to={actionLink}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white btn-gradient flex items-center gap-2"
        >
          {actionText} <ArrowRight className="w-4 h-4" />
        </Link>
      )}

      {actionText && onActionClick && !actionLink && (
        <button
          onClick={onActionClick}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white btn-gradient flex items-center gap-2"
        >
          {actionText} <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
