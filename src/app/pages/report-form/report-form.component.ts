import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from '../../core/api/report.service';

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
      tipoSegnalazione: ['Cittadino', Validators.required],
      paziente: this.fb.group({
        iniziali: ['', Validators.required],
        eta: [null, [Validators.required, Validators.min(0)]],
        sesso: ['', Validators.required],
        peso: [null],
        altezza: [null],
      }),
      reazione: this.fb.group({
        descrizione: ['', Validators.required],
        dataInizio: ['', Validators.required],
        dataFine: [''],
        esito: ['', Validators.required],
        gravita: this.fb.group({
          isGrave: [false],
        }),
      }),
      farmaciSospetti: this.fb.array([this.creaFormFarmaco()]),
      farmaciConcomitanti: this.fb.array([]),
      segnalatore: this.fb.group({
        qualifica: ['Cittadino', Validators.required],
      }),
      storiaClinica: [''],
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
          this.farmaciSospetti.clear();
          data.farmaciSospetti.forEach(() => this.aggiungiFarmacoSospetto());

          this.farmaciConcomitanti.clear();
          data.farmaciConcomitanti?.forEach(() => this.aggiungiFarmacoConcomitante());

          this.reportForm.patchValue({
            ...data,
            reazione: {
              ...data.reazione,
              dataInizio: this.formatDateForInput(data.reazione.dataInizio),
              dataFine: this.formatDateForInput(data.reazione.dataFine)
            },
            farmaciSospetti: data.farmaciSospetti.map(f => ({
              ...f,
              dataInizioTerapia: this.formatDateForInput(f.dataInizioTerapia),
              dataFineTerapia: this.formatDateForInput(f.dataFineTerapia)
            })),
            farmaciConcomitanti: data.farmaciConcomitanti?.map(f => ({
              ...f,
              dataInizioTerapia: this.formatDateForInput(f.dataInizioTerapia),
              dataFineTerapia: this.formatDateForInput(f.dataFineTerapia)
            })),
            localita: {
              lat: data.localita?.coordinates[1],
              lon: data.localita?.coordinates[0]
            }
          });
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Impossibile caricare i dati della segnalazione.';
          this.isLoading = false;
        }
      });
    }
  }

  private formatDateForInput(dateString: string | undefined): string {
    if (!dateString) {
      return '';
    }
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  creaFormFarmaco(): FormGroup {
    return this.fb.group({
      nomeCommerciale: ['', Validators.required],
      principioAttivo: [''],
      lotto: [''],
      dosaggio: [''],
      viaSomministrazione: [''],
      dataInizioTerapia: [''],
      dataFineTerapia: [''],
      indicazioneUso: ['']
    });
  }

  get farmaciSospetti(): FormArray {
    return this.reportForm.get('farmaciSospetti') as FormArray;
  }

  get farmaciConcomitanti(): FormArray {
    return this.reportForm.get('farmaciConcomitanti') as FormArray;
  }

  aggiungiFarmacoSospetto(): void {
    this.farmaciSospetti.push(this.creaFormFarmaco());
  }

  rimuoviFarmacoSospetto(index: number): void {
    this.farmaciSospetti.removeAt(index);
  }

  aggiungiFarmacoConcomitante(): void {
    this.farmaciConcomitanti.push(this.creaFormFarmaco());
  }

  rimuoviFarmacoConcomitante(index: number): void {
    this.farmaciConcomitanti.removeAt(index);
  }

  onSubmit(): void {
    if (this.reportForm.invalid) {
      alert('Per favore, compila tutti i campi obbligatori.');
      return;
    }
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
