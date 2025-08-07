import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Report, ReportService } from '../../core/api/report.service';
import { AiService, AiAnalysis } from '../../core/api/ai.service';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-ai-analyzer',
  templateUrl: './ai-analyzer.component.html',
  styleUrls: ['./ai-analyzer.component.scss']
})
export class AiAnalyzerComponent implements OnInit, OnDestroy {
  protected reports: Report[] = [];
  public selectedReport = new FormControl(null, Validators.required);

  public reportFilterCtrl: FormControl = new FormControl();
  public filteredReports: ReplaySubject<Report[]> = new ReplaySubject<Report[]>(1);
  protected _onDestroy = new Subject<void>();

  isLoadingReports = true;
  isLoadingAnalysis = false;
  analysisResult: AiAnalysis | null = null;
  error: string | null = null;

  constructor(
    private reportService: ReportService,
    private aiService: AiService
  ) {}

  ngOnInit(): void {
    const sortParams = { sortBy: 'createdAt', sortOrder: 'desc' };
    this.reportService.getReports(1, {}, sortParams, 0).subscribe(data => {
      this.reports = data.reports;
      this.filteredReports.next(this.reports.slice());
      this.isLoadingReports = false;
    });

    this.reportFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterReports();
      });
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected filterReports() {
    if (!this.reports) {
      return;
    }
    let search = this.reportFilterCtrl.value;
    if (!search) {
      this.filteredReports.next(this.reports.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredReports.next(
      this.reports.filter(report => {
        const reportText = `${report.farmaciSospetti[0]?.nomeCommerciale} ${report.paziente.iniziali}`.toLowerCase();
        return reportText.indexOf(search) > -1;
      })
    );
  }

  onAnalyze(): void {
    if (this.selectedReport.invalid || !this.selectedReport.value) {
      return;
    }
    this.isLoadingAnalysis = true;
    this.analysisResult = null;
    this.error = null;

    this.aiService.analyzeReport(this.selectedReport.value).subscribe({
      next: (result) => {
        console.log(result);
        this.analysisResult = result;
        this.isLoadingAnalysis = false;
      },
      error: (err) => {
        this.error = "Si è verificato un errore durante l'analisi AI.";
        this.isLoadingAnalysis = false;
        console.error(err);
      }
    });
  }
}
