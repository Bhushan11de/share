import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent {
  signinForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
  ) {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onSubmit() {
    if (this.signinForm.valid) {
      const { email, password } = this.signinForm.value;
      try {
        const response = await this.http
          .post('http://localhost:3000/api/login', { email, password })
          .toPromise();
        console.log('Signed in successfully', response);
      } catch (error) {
        console.error('Error signing in', error);
      }
    }
  }
}
