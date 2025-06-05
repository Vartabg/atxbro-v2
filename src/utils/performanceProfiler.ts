export class PerformanceProfiler {
  private metrics: { [key: string]: number } = {};
  private startTimes: { [key: string]: number } = {};

  startMeasure(label: string) {
    this.startTimes[label] = performance.now();
  }

  endMeasure(label: string) {
    if (this.startTimes[label]) {
      this.metrics[label] = performance.now() - this.startTimes[label];
      delete this.startTimes[label];
    }
  }

  getMetrics() {
    return { ...this.metrics };
  }

  logToConsole() {
    console.table(this.metrics);
  }
}

export const profiler = new PerformanceProfiler();
