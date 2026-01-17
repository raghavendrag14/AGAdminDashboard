import { Type, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
    
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ModalContentConfig {
  title?: string;
  template?: any;
  context?: any;

  component?: Type<any>;
  componentData?: any;
}

@Injectable({ providedIn: 'root' })
export class ModalService {
  private modalState = new BehaviorSubject<boolean>(false);
  modalState$ = this.modalState.asObservable();

  private modalContent = new BehaviorSubject<ModalContentConfig | null>(null);
  modalContent$ = this.modalContent.asObservable();

  private modalSize = new BehaviorSubject<ModalSize>('md');
  modalSize$ = this.modalSize.asObservable();

  private modalResult = new BehaviorSubject<any>(null);
  modalResult$ = this.modalResult.asObservable();

  open(config: ModalContentConfig, size: ModalSize = 'md') {
    try {
      console.log('[ModalService] open()', config, 'size=', size);
      // Guard: avoid repeatedly opening the same modal content (prevents accidental loops)
      const currentlyOpen = this.modalState.value;
      const currentContent = this.modalContent.value;
      const sameContent = JSON.stringify(currentContent) === JSON.stringify(config);
      if (currentlyOpen && sameContent) {
        console.log('[ModalService] open() ignored: same content already open');
        return;
      }
      this.modalContent.next(config);
      this.modalSize.next(size);
      this.modalState.next(true);
    } catch (err) {
      console.error('[ModalService] open() error', err);
    }
  }

  close(result?: any) {
    console.log('[ModalService] close()', result);
    this.modalResult.next(result);
    this.modalState.next(false);
  }

  /**
   * Synchronous getter for current modal content. Useful for templates/components that
   * need the current value without subscribing.
   */
  get modalContentValue(): ModalContentConfig | null {
    return this.modalContent.value;
  }
}


