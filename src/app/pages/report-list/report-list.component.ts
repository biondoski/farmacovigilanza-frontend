import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Report, ReportService, PaginatedReports } from '../../core/api/report.service';
import { take } from 'rxjs/operators';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss']
})
export class ReportListComponent implements OnInit {
  paginatedData: PaginatedReports | null = null;
  isLoading = true;
  error: string | null = null;

  currentPage = 1;
  filterForm: FormGroup;

  sortColumn: string = 'createdAt';
  sortOrder: 'asc' | 'desc' = 'desc';

  faSort = faSort;
  faSortUp = faSortUp;
  faSortDown = faSortDown;

  paginator: (string | number)[] = [];

  constructor(
    private reportService: ReportService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.filterForm = this.fb.group({
      farmaco: [''],
      gravita: [''],
      dataDa: [''],
      dataA: ['']
    });
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(take(1)).subscribe(params => {
      if (params['farmaco']) {
        this.filterForm.patchValue({ farmaco: params['farmaco'] });
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
        this.updatePaginator();
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Impossibile caricare le segnalazioni.';
        this.isLoading = false;
        console.error(err);
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
    this.loadReports();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= (this.paginatedData?.totalPages || 1)) {
      this.currentPage = page;
      this.loadReports();
    }
  }

  onExport(): void {
    this.reportService.exportReports().subscribe(blob => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);

      a.href = objectUrl;
      a.download = 'segnalazioni.csv';

      a.click();

      URL.revokeObjectURL(objectUrl);
    });
  }

  getPages(): number[] {
    if (!this.paginatedData) return [];
    return Array(this.paginatedData.totalPages).fill(0).map((x, i) => i + 1);
  }

  isNumber(value: any): value is number {
    return typeof value === 'number';
  }

  private updatePaginator(): void {
    if (!this.paginatedData) {
      this.paginator = [];
      return;
    }

    const currentPage = this.paginatedData.currentPage;
    const totalPages = this.paginatedData.totalPages;
    const pagesToShow = 5;
    const pages: (string | number)[] = [];

    if (totalPages <= pagesToShow + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let startPage = Math.max(2, currentPage - 2);
      let endPage = Math.min(totalPages - 1, currentPage + 2);

      if (currentPage < pagesToShow) {
        endPage = pagesToShow;
      }
      if (currentPage > totalPages - (pagesToShow-1)) {
        startPage = totalPages - (pagesToShow-1);
      }

      if (startPage > 2) {
        pages.push('...');
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages - 1) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    this.paginator = pages;
  }
}
