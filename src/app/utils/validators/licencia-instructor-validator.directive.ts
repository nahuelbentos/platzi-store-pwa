import { Directive } from '@angular/core';
import { AsyncValidatorFn, AsyncValidator, NG_ASYNC_VALIDATORS, AbstractControl, ValidationErrors } from '@angular/forms';

import { map } from 'rxjs/operators';

import { AcuService } from '@acu/services/acu.service';
import { Observable } from 'rxjs';

export function licenciaInstructorValidator(acuService: AcuService): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return acuService.licenciaInstructor(control.value).pipe(
      map(
        (res: any) => {
          // tslint:disable-next-line: object-literal-key-quotes
          return res.licencia ? { 'licenciaInstructor': true } : null;
        })
    );
  };
}

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[licenciaInstructor][formControlName],[licenciaInstructor][formControl],[licenciaInstructor][ngModel]',
  providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting: LicenciaInstructorValidatorDirective, multi: true }]
})
export class LicenciaInstructorValidatorDirective implements AsyncValidator {
  constructor(private acuService: AcuService) { }

  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return licenciaInstructorValidator(this.acuService)(control);
  }
}
