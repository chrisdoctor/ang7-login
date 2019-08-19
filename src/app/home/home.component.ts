import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import * as moment from 'moment';

import { User } from '@/models';
import { AlertService, UserService, AuthenticationService } from '@/services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit, OnDestroy {
    currentUser: User;
    currentUserSubscription: Subscription;
    users: User[] = [];
    userProfile: any;
    profileForm: FormGroup;
    loading = false;
    submitted = false;
    imgURL: any;
    fileAttachment: string;

    constructor(
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private formBuilder: FormBuilder,
        private alertService: AlertService,
        private router: Router,
    ) {
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = user;
        });

        this.loadUser(this.currentUser.id);
    }

    ngOnInit() {
        
    }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.currentUserSubscription.unsubscribe();
    }

    createForm() {
        this.profileForm = this.formBuilder.group( {
            firstName: [this.userProfile.firstName, Validators.required],
            lastName: [this.userProfile.lastName, Validators.required],
            userName: [this.userProfile.userName, [Validators.required, Validators.email]],
            password: [this.userProfile.password, [Validators.required, Validators.minLength(8)]],
            phone: [this.userProfile.phone, Validators.required],
            birthday: [this.userProfile.birthday, [Validators.required, this.dateValidator()]],
            address: this.formBuilder.array([])
        } )

        this.profileForm.setControl('address', this.setExistingAddress(this.userProfile.address))
    }

    setExistingAddress(addresses: any) {
        const formArray = new FormArray([]);
        addresses.forEach(a => {
            formArray.push(this.formBuilder.group({
                street1: a.street1,
                street2: a.street2,
                city: a.city,
                country: a.country,
                postcode: a.postcode
            }));
        });
        return formArray;
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

    fileUpload(files: any) {
        if (files.length === 0) return;
     
        let reader = new FileReader();    
        reader.readAsDataURL(files[0]); 
        reader.onload = (_event) => { 
            this.imgURL = reader.result; 
            this.fileAttachment = reader.result.toString();
        }
    }

    private loadUser(id) {
        this.userService.getById(id).pipe(first()).subscribe(user => {
            this.userProfile = user;
            //this.fileAttachment = this.userProfile.fileAttachment;
            this.imgURL = this.userProfile.fileAttachment;
            this.createForm();
        });
    }

    get f() { return this.profileForm.controls; }

    get AddressForm() {
        return this.profileForm.get('address') as FormArray;
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

    deleteAddress(i) {
        this.AddressForm.removeAt(i);
        this.AddressForm.markAsDirty();
        this.AddressForm.markAsTouched();
    }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.profileForm.invalid) {
            return;
        }

        this.loading = true;
        this.profileForm.value.fileAttachment = this.fileAttachment;

        this.userService.update(this.currentUser.id, this.profileForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('User information saved', true);
                    this.loading = false;
                    window.scrollTo(0, 0);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}