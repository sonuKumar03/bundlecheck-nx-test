import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  durationMs?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSignal = signal<ToastMessage[]>([]);
  readonly toasts = this.toastsSignal.asReadonly();

  show(toast: Omit<ToastMessage, 'id'>) {
    const id = 'toast_' + Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = {
      ...toast,
      id,
      durationMs: toast.durationMs ?? 4000
    };

    this.toastsSignal.update(list => [...list, newToast]);

    if (newToast.durationMs && newToast.durationMs > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, newToast.durationMs);
    }
  }

  success(message: string, title: string = 'Success') {
    this.show({ type: 'success', title, message });
  }

  info(message: string, title: string = 'Info') {
    this.show({ type: 'info', title, message });
  }

  warning(message: string, title: string = 'Warning') {
    this.show({ type: 'warning', title, message });
  }

  error(message: string, title: string = 'Error') {
    this.show({ type: 'error', title, message });
  }

  dismiss(id: string) {
    this.toastsSignal.update(list => list.filter(t => t.id !== id));
  }
}
