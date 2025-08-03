import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router';
import { AnalyticsService, ReactionStat, MonthlyTrend, HotLot, SymptomCorrelation, DemographicAnalysis } from '../../core/api/analytics.service';
import { map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  ageAnalysisData: { name: string, value: number }[] = [];
  genderAnalysisData: { name: string, value: number }[] = [];
  symptomCorrelationData: any[] = [];
  hotLotsData: HotLot[] = [];
  filterForm: FormGroup;
  isLoading = false;
  reactionForm: FormGroup;
  reactionResults: { name: string, value: number }[] = [];
  isReactionLoading = false;

  trendForm: FormGroup;
  trendResults: { name: string, series: { name: string, value: number }[] }[] = [];
  isTrendLoading = false;

  reportsByDrugData: { name: string, value: number }[] = [];
  isDrugChartLoading = true;

  reportsBySeverityData: { name: string, value: number }[] = [];

  constructor(
    private fb: FormBuilder,
    private analyticsService: AnalyticsService,
    private router: Router
  ) {

    this.filterForm = this.fb.group({
      farmaco: [''],
      dataDa: [''],
      dataA: ['']
    });

    this.reactionForm = this.fb.group({
      farmaco: ['Aspirina'],
      etaMin: [30],
      etaMax: [70]
    });

    this.trendForm = this.fb.group({
      farmaco: ['Aspirina']
    });
  }

  ngOnInit(): void {
    this.loadReportsByDrug();
    this.applyFilters();
  }

  applyFilters(): void {
    this.isLoading = true;
    const filters = this.filterForm.value;

    const dynamicAnalysis$ = this.analyticsService.runDynamicAnalysis(filters);
    const symptomCorrelation$ = this.analyticsService.getSymptomCorrelation(filters);
    const demographicAnalysis$ = this.analyticsService.getDemographicAnalysis(filters);
    const observables: any = { dynamicData: dynamicAnalysis$, correlationData: symptomCorrelation$, demographicData: demographicAnalysis$ };

    if (filters.farmaco) {
      observables.hotLotsData = this.analyticsService.getHotLotsByDrug(filters.farmaco);
    } else {
      this.hotLotsData = [];
    }

    forkJoin(observables).subscribe((results: any) => {
      this.reportsByDrugData = results.dynamicData.reportsByDrug.map((item: { _id: string, count: number }) => ({ name: item._id, value: item.count }));
      this.reportsBySeverityData = results.dynamicData.reportsBySeverity.map((item: { _id: string, count: number }) => ({ name: item._id, value: item.count }));

      if (results.hotLotsData) {
        this.hotLotsData = results.hotLotsData;
      }

      this.symptomCorrelationData = this.transformCorrelationData(results.correlationData);

      this.ageAnalysisData = results.demographicData.byAge.map((item: any) => {
        let ageRange = '';
        if (item._id === 'Sconosciuta') {
          ageRange = 'N/D';
        } else {
          const boundaries = results.demographicData.byAge.map((b: any) => b._id).filter((id: any) => id !== 'Sconosciuta');
          const currentIndex = boundaries.indexOf(item._id);
          const nextBoundary = boundaries[currentIndex + 1];
          ageRange = nextBoundary ? `${item._id}-${nextBoundary - 1}` : `${item._id}+`;
        }
        return { name: ageRange, value: item.conteggio };
      });

      this.genderAnalysisData = results.demographicData.byGender.map((item: any) => ({ name: item._id, value: item.conteggio }));

      this.isLoading = false;
    });
  }

  private transformCorrelationData(data: SymptomCorrelation[]): any[] {
    const seriesMap = new Map<string, { name: string, value: number }[]>();

    data.forEach(item => {
      const [sintomoA, sintomoB] = item._id;
      const value = item.conteggio;

      if (!seriesMap.has(sintomoA)) seriesMap.set(sintomoA, []);
      seriesMap.get(sintomoA)!.push({ name: sintomoB, value });

      if (!seriesMap.has(sintomoB)) seriesMap.set(sintomoB, []);
      seriesMap.get(sintomoB)!.push({ name: sintomoA, value });
    });

    const formattedData = Array.from(seriesMap.entries()).map(([name, series]) => ({
      name,
      series
    }));

    return formattedData;
  }

  loadReportsByDrug(): void {
    this.isDrugChartLoading = true;
    this.analyticsService.getReportsByDrug()
      .pipe(map(data => data.map(item => ({ name: item._id, value: item.conteggio }))))
      .subscribe(results => {
        this.reportsByDrugData = results;
        this.isDrugChartLoading = false;
      });
  }

  onSearchReactions(): void {
    if (this.reactionForm.invalid) return;
    this.isReactionLoading = true;
    const { farmaco, etaMin, etaMax } = this.reactionForm.value;

    this.analyticsService.getReactionsByDrugAndAge(farmaco, etaMin, etaMax)
      .pipe(
        map(data => data.map(item => ({ name: item._id, value: item.conteggio })))
      )
      .subscribe(results => {
        this.reactionResults = results;
        this.isReactionLoading = false;
      });
  }

  onSearchTrend(): void {
    if (this.trendForm.invalid) return;
    this.isTrendLoading = true;
    const { farmaco } = this.trendForm.value;

    this.analyticsService.getMonthlyTrendByDrug(farmaco)
      .pipe(
        map(data => [{
          name: farmaco,
          series: data.map(item => ({
            name: `${item._id.mese}/${item._id.anno}`,
            value: item.conteggio
          }))
        }])
      )
      .subscribe(results => {
        this.trendResults = results;
        this.isTrendLoading = false;
      });
  }

  onChartClick(event: any): void {
    const farmacoSelezionato = event.name || event;

    if (farmacoSelezionato) {
      console.log(`Navigo alla lista filtrando per: ${farmacoSelezionato}`);
      this.router.navigate(['/reports'], {
        queryParams: { farmaco: farmacoSelezionato }
      });
    }
  }
}
