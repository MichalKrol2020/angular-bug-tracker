import {FormControl, FormGroup, ValidationErrors} from "@angular/forms";

export class AuthenticationValidators
{

  static handleWhitespaces(control: FormControl): ValidationErrors | null
  {
    if((control.value as string).indexOf(' ') >= 0)
    {
      return {'onlyWhitespace': true};
    } else
    {
      return null;
    }
  }

  static matchingPassword(password: string, confirmPassword: string)
  {
    return(formGroup: FormGroup) =>
    {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];

      if(!passwordControl || !confirmPasswordControl)
      {
        return;
      }

      if(passwordControl.value !== confirmPasswordControl.value)
      {
        confirmPasswordControl.setErrors
        ({
          matchingPassword: true
        })
      } else
      {
        confirmPasswordControl.setErrors(null);
      }
    }
  }
}
