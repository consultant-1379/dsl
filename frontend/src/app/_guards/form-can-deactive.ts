import { NgForm, FormGroup } from '@angular/forms';
import { ComponentCanDeactivate } from './component-can-deactivate';

export abstract class FormCanDeactivate extends ComponentCanDeactivate {

  abstract get form(): FormGroup;

  canDeactivate(): boolean {
    return !this.form.dirty;
  }
}
