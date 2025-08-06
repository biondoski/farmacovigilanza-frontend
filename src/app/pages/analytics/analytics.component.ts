import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AnalyticsService, DynamicAnalytics, HotLot, SymptomCorrelation, DemographicAnalysis, AgeAnalysis } from '../../core/api/analytics.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  filterForm: FormGroup;
  isLoading = true;

  reportsByDrugData: { name: string, value: number }[] = [];
  reportsBySeverityData: { name: string, value: number }[] = [];
  hotLotsData: HotLot[] = [];
  symptomCorrelationData: any[] = [];
  ageAnalysisData: { name: string, value: number }[] = [];
  genderAnalysisData: { name: string, value: number }[] = [];

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
  }

  ngOnInit(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.isLoading = true;
    const filters = this.filterForm.value;

    const observables: any = {
      dynamicData: this.analyticsService.runDynamicAnalysis(filters),
      correlationData: this.analyticsService.getSymptomCorrelation(filters),
      demographicData: this.analyticsService.getDemographicAnalysis(filters)
    };

    if (filters.farmaco) {
      observables.hotLotsData = this.analyticsService.getHotLotsByDrug(filters.farmaco);
    } else {
      this.hotLotsData = [];
    }

    forkJoin(observables).subscribe({
      next: (results: any) => {
        this.reportsByDrugData = results.dynamicData.reportsByDrug.map((item: { _id: string, count: number }) => ({ name: item._id, value: item.count }));
        this.reportsBySeverityData = results.dynamicData.reportsBySeverity.map((item: { _id: string, count: number }) => ({ name: item._id, value: item.count }));
        this.symptomCorrelationData = this.transformCorrelationData(results.correlationData);
        this.ageAnalysisData = this.transformAgeData(results.demographicData.byAge);
        this.genderAnalysisData = results.demographicData.byGender.map((item: { _id: string, conteggio: number }) => ({ name: item._id, value: item.conteggio }));

        if (results.hotLotsData) {
          this.hotLotsData = results.hotLotsData;
        }

        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        // Gestire errore
      }
    });
  }

  private transformCorrelationData(data: SymptomCorrelation[]): any[] {
    if (!data) return [];
    const seriesMap = new Map<string, { name: string, value: number }[]>();
    data.filter(item => item && item._id).forEach(item => {
      const [sintomoA, sintomoB] = item._id;
      const value = item.conteggio;
      if (!seriesMap.has(sintomoA)) seriesMap.set(sintomoA, []);
      seriesMap.get(sintomoA)!.push({ name: sintomoB, value });
      if (!seriesMap.has(sintomoB)) seriesMap.set(sintomoB, []);
      seriesMap.get(sintomoB)!.push({ name: sintomoA, value });
    });
    return Array.from(seriesMap.entries()).map(([name, series]) => ({ name, series }));
  }

  private transformAgeData(data: AgeAnalysis[]): { name: string, value: number }[] {
    if (!data) return [];
    return data.map(item => {
      let ageRange = '';
      if (item._id === 'Sconosciuta') {
        ageRange = 'N/D';
      } else {
        const boundaries = [0, 18, 40, 65, 120];
        const currentIndex = boundaries.indexOf(item._id as number);
        const nextBoundary = boundaries[currentIndex + 1];
        ageRange = nextBoundary ? `${item._id}-${nextBoundary - 1}` : `${item._id}+`;
      }
      return { name: ageRange, value: item.conteggio };
    });
  }

  onChartClick(event: any): void {
    const farmacoSelezionato = event.name || event;
    if (farmacoSelezionato) {
      this.router.navigate(['/reports'], {
        queryParams: { farmaco: farmacoSelezionato }
      });
    }
  }
}
