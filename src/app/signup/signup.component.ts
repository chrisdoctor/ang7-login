import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import * as moment from 'moment';

import { AlertService, UserService, AuthenticationService } from '@/services';

@Component({templateUrl: 'signup.component.html'})

export class SignupComponent implements OnInit {
    signupForm: FormGroup;
    loading = false;
    submitted = false;
    reader = new FileReader();

    imgURL: any;
    fileAttachment: string;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService,
    ) { 
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) { 
            this.router.navigate(['/']);
        }

        this.createForm();
    }

    ngOnInit() {
    }

    createForm() {
        this.signupForm = this.formBuilder.group( {
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            userName: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            phone: ['', Validators.required],
            birthday: ['', [Validators.required, this.dateValidator()]],
            address: this.formBuilder.array([
                this.formBuilder.group({
                    street1: ['', Validators.required],
                    street2: [''],
                    city: ['', Validators.required],
                    country: ['', Validators.required],
                    postcode: ['', Validators.required]
                })
            ])
        } )
    }

    dateValidator(format = "YYYY-MM-DD"): any {
        return (control: FormControl): { [key: string]: any } => {
          const val = moment(control.value, format, true);
          if (!val.isValid()) {
            return { invalidDate: true };
          }
      
          return null;
        };
    }

    get AddressForm() {
        return this.signupForm.get('address') as FormArray;
    }

    addAddress() {
        const addressGroup = this.formBuilder.group({
            street1: ['', Validators.required],
            street2: [''],
            city: ['', Validators.required],
            country: ['', Validators.required],
            postcode: ['', Validators.required]
        });
        this.AddressForm.push(addressGroup);
    }

    deleteAddress(i: any) {
        this.AddressForm.removeAt(i);
    }

    fileUpload(files: any) {
        if (files.length === 0) return;
     
        let reader = new FileReader();    
        reader.readAsDataURL(files[0]); 
        reader.onload = (_event) => { 
            this.imgURL = reader.result; 
            this.fileAttachment = reader.result.toString();
        }
    }

    get f() { return this.signupForm.controls; }

    onSubmit() {
        this.submitted = true;

        console.log(this.signupForm);
        if (this.signupForm.invalid) {
            window.scrollTo({top: 0, behavior: 'smooth'});
            return;
        }

        this.signupForm.value.fileAttachment = this.fileAttachment;

        this.loading = true;
        this.userService.signup(this.signupForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Signup successful', true);
                    this.router.navigate(['/login']);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}
