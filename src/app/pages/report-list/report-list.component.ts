import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Report, ReportService, PaginatedReports } from '../../core/api/report.service';
import { take } from 'rxjs/operators';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px', minHeight: '0', padding: '0 24px' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ReportListComponent implements OnInit {
  paginatedData: PaginatedReports | null = null;
  isLoading = true;
  error: string | null = null;

  currentPage = 1;
  filterForm: FormGroup;

  sortColumn: string = 'createdAt';
  sortOrder: 'asc' | 'desc' = 'desc';

  displayedColumns: string[] = ['data', 'farmaco', 'eta', 'esito', 'gravita', 'segnalatore', 'azioni'];
  expandedElement: Report | null = null;

  constructor(
    private reportService: ReportService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.filterForm = this.fb.group({
      farmaco: [''],
      dataDa: [''],
      dataA: ['']
    });
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(take(1)).subscribe((params: any) => {
      if (params['farmaco']) {
        this.filterForm.patchValue({ farmaco: params['farmaco'] }, { emitEvent: false });
      }
    });

    this.loadReports();

    this.filterForm.valueChanges.subscribe(() => {
      this.currentPage = 1;
      this.loadReports();
    });
  }

  loadReports(): void {
    this.isLoading = true;
    const sortParams = { sortBy: this.sortColumn, sortOrder: this.sortOrder };

    this.reportService.getReports(this.currentPage, this.filterForm.value, sortParams).subscribe({
      next: (data) => {
        this.paginatedData = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Impossibile caricare le segnalazioni.';
        this.isLoading = false;
      }
    });
  }

  onSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortOrder = 'asc';
    }
    this.currentPage = 1;
    this.loadReports();
  }

  handlePageEvent(event: any): void {
    this.currentPage = event.pageIndex + 1;
    this.loadReports();
  }

  onExport(): void {
    this.reportService.exportReports().subscribe({
      next: (blob) => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = 'segnalazioni.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(objectUrl);
      },
      error: (err) => {
        alert("Si è verificato un errore durante l'esportazione.");
      }
    });
  }
}
