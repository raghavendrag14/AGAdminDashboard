import { Component, Injector, ViewChild, ViewContainerRef, ComponentRef } from '@angular/core';
import { ModalService } from './model.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html'
})
export class ModalComponent {

  constructor(public modal: ModalService, private injector: Injector) {}
  private _subs: Array<any> = [];
  @ViewChild('dynamicHost', { read: ViewContainerRef, static: false }) dynamicHost!: ViewContainerRef;
  private _dynamicRef?: ComponentRef<any>;

  // debug: log modal state changes so we can see when overlay should appear
  // keep lightweight and non-blocking
  ngOnInit() {
    this._subs.push(this.modal.modalState$.subscribe(s => {
      console.log('[ModalComponent] modalState=', s);
      // defensive DOM toggle: ensure overlay shows even if CSS class binding fails
      try {
        const el = document.getElementById('globalModalOverlay');
        if (el) {
          if (s) {
            el.classList.add('active');
            el.style.opacity = '1';
            el.style.visibility = 'visible';
            el.style.pointerEvents = 'auto';
          } else {
            el.classList.remove('active');
            el.style.opacity = '0';
            el.style.visibility = 'hidden';
            el.style.pointerEvents = 'none';
          }
        }
      } catch (err) {
        console.error('[ModalComponent] error toggling overlay DOM', err);
      }
    }));
    this._subs.push(this.modal.modalContent$.subscribe(c => {
      console.log('[ModalComponent] modalContent=', c);
      // if a dynamic component is requested, create it programmatically in the host
      try {
        const create = () => {
          // clear previous
          if (this.dynamicHost) this.dynamicHost.clear();
          if (this._dynamicRef) {
            this._dynamicRef.destroy();
            this._dynamicRef = undefined;
          }
          if (c?.component) {
              const injector = this.createChildInjector();
              // use ViewContainerRef.createComponent to ensure the component is instantiated with the right injector
              this._dynamicRef = this.dynamicHost.createComponent<any>(c.component, { injector });
              try {
                // ensure change detection runs for the newly created component
                this._dynamicRef.changeDetectorRef.detectChanges();
              } catch (err) {
                console.warn('[ModalComponent] detectChanges() failed', err);
              }
              console.log('[ModalComponent] created dynamic component', this._dynamicRef?.instance);
              try {
                const hostEl = document.getElementById('globalModal');
                console.log('[ModalComponent] modal innerHTML after create:', hostEl?.innerHTML?.slice(0, 400));
              } catch (err) {
                console.warn('[ModalComponent] cannot read modal innerHTML', err);
              }
            } else {
              // no component requested: ensure host is clear
              if (this.dynamicHost) this.dynamicHost.clear();
              if (this._dynamicRef) { this._dynamicRef.destroy(); this._dynamicRef = undefined; }
            }
        };

        if (!this.dynamicHost) {
          // ViewChild may not be ready if the host sits inside an *ngIf; schedule for next microtask
          Promise.resolve().then(() => {
            if (!this.dynamicHost) {
              console.warn('[ModalComponent] dynamicHost still not available when creating component');
              return;
            }
            create();
          });
        } else {
          create();
        }
      } catch (err) {
        console.error('[ModalComponent] error creating dynamic component', err);
      }
    }));
  }

  ngOnDestroy() {
    this._subs.forEach(s => s?.unsubscribe && s.unsubscribe());
    this._subs = [];
  }

  ngAfterViewInit() {
    // quick DOM sanity check when modal host initializes
    setTimeout(() => {
      const el = document.getElementById('globalModalOverlay');
      console.log('[ModalComponent] DOM overlay exists=', !!el);
      if (el) {
        const cs = getComputedStyle(el as Element);
        console.log('[ModalComponent] overlay computed style:', { opacity: cs.opacity, visibility: cs.visibility, display: cs.display });
      }
    }, 0);
  }

  close(result?: any) {
    this.modal.close(result);
  }

  createChildInjector() {
    const content = this.modal.modalContentValue;

    if (!content?.componentData) return this.injector;

    return Injector.create({
      providers: [
        { provide: 'modalData', useValue: content.componentData },
        { provide: 'modalClose', useValue: (result: any) => this.close(result) }
      ],
      parent: this.injector
    });
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close();
    }
  }
}
