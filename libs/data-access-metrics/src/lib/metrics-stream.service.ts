import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface PerformanceMetric {
  id: string;
  timestamp: number;
  cpuUsagePct: number;
  memoryUsedMb: number;
  requestsPerSecond: number;
  avgLatencyMs: number;
  status: 'healthy' | 'warning' | 'degraded';
}

@Injectable({
  providedIn: 'root'
})
export class MetricsStreamService {
  getSystemMetrics(): Observable<PerformanceMetric[]> {
    const now = Date.now();
    const sampleData: PerformanceMetric[] = Array.from({ length: 12 }, (_, i) => ({
      id: `metric_${i}`,
      timestamp: now - (11 - i) * 60000,
      cpuUsagePct: Math.round(35 + Math.random() * 40),
      memoryUsedMb: Math.round(1024 + Math.random() * 512),
      requestsPerSecond: Math.round(450 + Math.random() * 300),
      avgLatencyMs: Math.round(18 + Math.random() * 25),
      status: 'healthy'
    }));
    return of(sampleData);
  }
}
