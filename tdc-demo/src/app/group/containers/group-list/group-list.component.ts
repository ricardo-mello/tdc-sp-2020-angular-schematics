import { Component, OnInit, ViewChild } from '@angular/core';
import {
  PoBreadcrumb,
  PoModalAction,
  PoModalComponent,
  PoNotificationService,
  PoTableAction,
  PoTableColumn,
  PoToasterOrientation
} from '@po-ui/ng-components';
import { Group } from '../../models/group.model';
import { TranslocoService } from '@ngneat/transloco';
import { GroupService } from '../../services/group.service';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit {
  @ViewChild('deleteModal') deleteModal: PoModalComponent;
  @ViewChild('duplicateModal') duplicateModal: PoModalComponent;

  groups: Group[];
  filteredGroups: Group[];

  loading: boolean;
  loaded: boolean;

  modalActions: { primary?: PoModalAction; secondary?: PoModalAction };

  readonly breadcrumb: PoBreadcrumb = {
    items: [
      { label: this.translocoService.translate('Home'), link: '/' },
      { label: this.translocoService.translate('Groups') }
    ]
  };

  readonly pageActions = [
    {
      label: this.translocoService.translate('Add Group'),
      type: 'primary',
      callback: () =>
        this.router.navigate(['create'], { relativeTo: this.route })
    }
  ];

  readonly tableActions: PoTableAction[] = [
    {
      action: (group: Group) => {
        this.router.navigate(['edit', group.id], { relativeTo: this.route });
      },
      icon: 'po-icon po-icon-edit',
      label: this.translocoService.translate('Edit')
    },
    {
      action: (group: Group) => this.openDuplicateModal(group),
      icon: 'po-icon po-icon-copy',
      label: this.translocoService.translate('Duplicate')
    },
    {
      action: (group: Group) => this.openDeleteModal(group),
      icon: 'po-icon po-icon-delete',
      label: this.translocoService.translate('Delete')
    }
  ];

  readonly columns: PoTableColumn[] = [
    {
      property: 'active',
      label: this.translocoService.translate('Active'),
      type: 'switch',
      width: '10%'
    },
    {
      property: 'name',
      label: this.translocoService.translate('Group'),
      width: '90%'
    }
  ];

  constructor(
    private poNotificationService: PoNotificationService,
    private translocoService: TranslocoService,
    private groupService: GroupService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.fetchList();
  }

  fetchList() {
    this.groupService
      .getAll()
      .pipe(finalize(() => (this.loaded = true)))
      .subscribe(data => {
        this.groups = data;
        this.filteredGroups = data;
      });
  }

  toggleActivation(group: Group) {
    this.groupService.toggleActivation(group).subscribe();
  }

  search(text: string) {
    // Implement search
  }

  openDuplicateModal(group: Group) {
    this.modalActions = {
      primary: {
        label: this.translocoService.translate('Confirm'),
        action: () => this.duplicateGroup(group)
      },
      secondary: {
        label: this.translocoService.translate('Cancel'),
        action: () => this.duplicateModal.close()
      }
    };
    this.duplicateModal.open();
  }

  duplicateGroup(group: Group) {
    this.loading = true;
    this.duplicateModal.close();
    this.groupService
      .duplicate(group.id)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(() => {
        this.fetchList();

        this.poNotificationService.success({
          orientation: PoToasterOrientation.Top,
          message: this.translocoService.translate(
            'Group successfully duplicated'
          )
        });
      });
  }

  openDeleteModal(group: Group) {
    this.modalActions = {
      primary: {
        label: this.translocoService.translate('Confirm'),
        danger: true,
        action: () => this.deleteGroup(group)
      },
      secondary: {
        label: this.translocoService.translate('Cancel'),
        action: () => this.deleteModal.close()
      }
    };
    this.deleteModal.open();
  }

  deleteGroup(group: Group) {
    this.loading = true;
    this.deleteModal.close();

    this.groupService
      .delete(group.id)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(() => {
        this.fetchList();

        this.poNotificationService.success({
          orientation: PoToasterOrientation.Top,
          message: this.translocoService.translate('Group successfully removed')
        });
      });
  }
}
