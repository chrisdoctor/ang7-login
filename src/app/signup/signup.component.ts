import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

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
            userName: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(8)]],
            phone: ['', Validators.required],
            birthday: ['', Validators.required],
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

        if (this.signupForm.invalid) {
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
