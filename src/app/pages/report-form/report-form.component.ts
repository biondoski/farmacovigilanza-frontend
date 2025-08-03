import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService, ReportPayload } from '../../core/api/report.service';

@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.scss']
})
export class ReportFormComponent implements OnInit {
  reportForm: FormGroup;
  isEditMode = false;
  reportId: string | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private reportService: ReportService
  ) {
    this.reportForm = this.fb.group({
      farmaco: this.fb.group({
        nomeCommerciale: ['', Validators.required],
        principioAttivo: ['', Validators.required],
        lotto: ['']
      }),
      paziente: this.fb.group({
        eta: [null, [Validators.required, Validators.min(0)]],
        sesso: ['', Validators.required]
      }),
      reazione: this.fb.group({
        descrizione: ['', Validators.required],
        gravita: ['Sconosciuta', Validators.required]
      }),
      localita: this.fb.group({
        lat: [null, [Validators.min(-90), Validators.max(90)]],
        lon: [null, [Validators.min(-180), Validators.max(180)]]
      })
    });
  }

  ngOnInit(): void {
    this.reportId = this.route.snapshot.paramMap.get('id');

    if (this.reportId) {
      this.isEditMode = true;
      this.isLoading = true;
      this.reportService.getReportById(this.reportId).subscribe({
        next: (data) => {
          const formData = {
            ...data,
            localita: {
              lat: data.localita?.coordinates[1],
              lon: data.localita?.coordinates[0]
            }
          };
          this.reportForm.patchValue(formData);
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Impossibile caricare i dati della segnalazione.';
          this.isLoading = false;
        }
      });
    }
  }

  onSubmit(): void {
    if (this.reportForm.invalid) return;

    this.isLoading = true;

    const formValue = this.reportForm.value;
    const reportData: any = {
      ...formValue,
      localita: (formValue.localita.lat && formValue.localita.lon) ? {
        type: 'Point',
        coordinates: [formValue.localita.lon, formValue.localita.lat]
      } : undefined
    };

    if (this.isEditMode && this.reportId) {
      this.reportService.updateReport(this.reportId, reportData).subscribe({
        next: () => this.router.navigate(['/reports']),
        error: (err) => this.handleError(err)
      });
    } else {
      this.reportService.createReport(reportData).subscribe({
        next: () => this.router.navigate(['/reports']),
        error: (err) => this.handleError(err)
      });
    }
  }

  private handleError(error: any): void {
    this.errorMessage = 'Si è verificato un errore durante il salvataggio.';
    this.isLoading = false;
    console.error(error);
  }
}
