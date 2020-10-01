import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { FormBuilder, Validators } from '@angular/forms';
import {
  PoBreadcrumb,
  PoNotificationService,
  PoToasterOrientation
} from '@po-ui/ng-components';
import { GroupService } from '../../services/group.service';
import { GroupForm } from '../../models/group.model';

@Component({
  selector: 'app-group-form',
  templateUrl: './group-form.component.html',
  styleUrls: ['./group-form.component.scss']
})
export class GroupFormComponent implements OnInit {
  readonly groupForm = this.formBuilder.group({
    id: [''],
    name: ['', Validators.required],
    active: [true, Validators.required]
  });

  readonly breadcrumb: PoBreadcrumb = {
    items: [
      { label: this.translocoService.translate('Home'), link: '/' },
      { label: this.translocoService.translate('Groups'), link: '/groups' },
      { label: this.translocoService.translate('New Group') }
    ]
  };

  constructor(
    private formBuilder: FormBuilder,
    private translocoService: TranslocoService,
    private groupService: GroupService,
    private poNotificationService: PoNotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchGroup();
  }

  fetchGroup() {
    const { id } = this.route.snapshot.params;
    if (!id) return;

    this.groupService
      .get(id)
      .subscribe(group => this.groupForm.patchValue(group));
  }

  onSubmit({ value, valid }: { value: GroupForm; valid: boolean }) {
    if (!valid) {
      return this.poNotificationService.warning({
        message: this.translocoService.translate('Verify the required fields'),
        orientation: PoToasterOrientation.Top
      });
    }

    this.groupService.save(value).subscribe(res => {
      this.poNotificationService.success({
        message: this.translocoService.translate(
          'Group successfully registered.'
        ),
        orientation: PoToasterOrientation.Top
      });

      this.router.navigate(['/groups']);
    });
  }
}
