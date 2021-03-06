import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UsersApiService } from '../users-api.service';
import { UserModel } from '../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users-create',
  templateUrl: './users-create.component.html',
  styleUrls: ['./users-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersCreateComponent implements OnInit, OnDestroy {
  public recordForm: FormGroup;
  public saving = false;
  public saved = false;
  private savingSubscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private usersApi: UsersApiService,
    private changeDetector: ChangeDetectorRef,
    private router: Router,
  ) { }

  ngOnInit() {
    this.recordForm = this.formBuilder.group({
      id: null,
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
    });
  }

  ngOnDestroy() {
    this.savingSubscription.unsubscribe();
  }

  save() {
    const formValues = this.recordForm.value;
    const payload: UserModel = {
      id: formValues.id,
      first_name: formValues.firstName,
      last_name: formValues.lastName
    };
    this.saving = true;
    this.saved = false;
    this.recordForm.disable();
    this.savingSubscription = this.usersApi.saveUser(payload).subscribe(res => {
      this.saving = false;
      this.saved = true;
      this.recordForm.reset();
      this.recordForm.enable();
      this.changeDetector.markForCheck();
    },
      error => {
        this.recordForm.enable();
        this.saving = false;
      }
    );
  }

  cancel() {
    this.router.navigate([`/users/list`]);
  }

}
