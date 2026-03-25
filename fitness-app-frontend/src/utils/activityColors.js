import {
  Footprints,
  Bike,
  Waves,
  Dumbbell,
  Heart,
  Zap,
  Activity,
  PersonStanding,
  Move,
  MoreHorizontal,
} from 'lucide-react';

export const ACTIVITY_CONFIG = {
  RUNNING: { icon: Footprints, color: '#7c3aed', label: 'Running' },
  WALKING: { icon: Footprints, color: '#06b6d4', label: 'Walking' },
  CYCLING: { icon: Bike, color: '#10b981', label: 'Cycling' },
  SWIMMING: { icon: Waves, color: '#0ea5e9', label: 'Swimming' },
  WEIGHT_TRAINING: { icon: Dumbbell, color: '#ec4899', label: 'Weight Training' },
  YOGA: { icon: PersonStanding, color: '#a855f7', label: 'Yoga' },
  CARDIO: { icon: Heart, color: '#ef4444', label: 'Cardio' },
  HIIT: { icon: Zap, color: '#f97316', label: 'HIIT' },
  STRETCHING: { icon: Move, color: '#eab308', label: 'Stretching' },
  OTHER: { icon: Activity, color: '#94a3b8', label: 'Other' },
};

export function getActivityConfig(type) {
  return ACTIVITY_CONFIG[type] || { icon: MoreHorizontal, color: '#94a3b8', label: type || 'Unknown' };
}
