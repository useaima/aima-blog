import { CheckCircle2, Award, BookOpen, Star } from 'lucide-react';

interface VerificationBadgeProps {
  type?: 'expert' | 'researcher' | 'industry-leader' | 'thought-leader';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function VerificationBadge({ type = 'expert', size = 'md', showLabel = true }: VerificationBadgeProps) {
  const badgeConfig = {
    expert: {
      icon: Award,
      label: 'Verified Expert',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      tooltip: 'Verified expert in their field',
    },
    researcher: {
      icon: BookOpen,
      label: 'Verified Researcher',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      tooltip: 'Verified researcher with published work',
    },
    'industry-leader': {
      icon: Star,
      label: 'Industry Leader',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/20',
      tooltip: 'Recognized industry leader',
    },
    'thought-leader': {
      icon: CheckCircle2,
      label: 'Thought Leader',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      tooltip: 'Recognized thought leader',
    },
  };

  const config = badgeConfig[type];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const containerSizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  if (!showLabel) {
    return (
      <div title={config.tooltip} className="inline-flex">
        <Icon className={`${sizeClasses[size]} ${config.color}`} />
      </div>
    );
  }

  return (
    <div
      title={config.tooltip}
      className={`inline-flex items-center gap-1.5 ${containerSizeClasses[size]} rounded-full border ${config.borderColor} ${config.bgColor}`}
    >
      <Icon className={`${sizeClasses[size]} ${config.color}`} />
      <span className={`font-semibold ${config.color}`}>{config.label}</span>
    </div>
  );
}
