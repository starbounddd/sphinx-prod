// Safety monitoring types
export interface SafetyEvent {
  id: number;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface DetectionResult {
  detected: boolean;
  confidence: number;
  reason?: string;
}
