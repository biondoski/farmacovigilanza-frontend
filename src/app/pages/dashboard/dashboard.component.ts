import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { User } from '../../models/user';
import { DashboardService, DashboardSummary } from '../../core/api/dashboard.service';
import { faNotesMedical, faCapsules, faExclamationTriangle, faGlobeEurope, faBiohazard, faUserMd, faVenusMars } from '@fortawesome/free-solid-svg-icons';
import * as L from 'leaflet';
import 'leaflet.heat';
import { LegendPosition } from '@swimlane/ngx-charts';


const iconDefault = L.icon({
  iconUrl: 'assets/marker-icon.png',
  shadowUrl: 'assets/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild('mapContainer') set mapContainer(element: ElementRef) {
    if (element && !this.markerMap) {
      this.initMarkerMap(element.nativeElement);
    }
  }

  @ViewChild('heatmapContainer') set heatmapContainer(element: ElementRef) {
    if (element && !this.heatmap) {
      this.initHeatmap(element.nativeElement);
    }
  }

  user: User | null = null;
  summaryData: DashboardSummary | null = null;
  isLoading = true;
  error: string | null = null;

  faNotesMedical = faNotesMedical;
  faCapsules = faCapsules;
  faExclamationTriangle = faExclamationTriangle;
  faGlobeEurope = faGlobeEurope;
  faBiohazard = faBiohazard;
  faUserMd = faUserMd;
  faVenusMars = faVenusMars;

  severityChartData: { name: string, value: number }[] = [];
  sourceChartData: { name: string, value: number }[] = [];
  genderChartData: { name: string, value: number }[] = [];
  legendPositionValue: LegendPosition = LegendPosition.Below;

  private markerMap: L.Map | undefined;
  private heatmap: L.Map | undefined;
  private heatLayer: any | null = null;
  private markerLegendControl: L.Control | null = null;
  private heatmapLegendControl: L.Control | null = null;

  private markerColors = ['blue', 'green', 'red', 'orange', 'purple', 'black'];
  private drugIconMap = new Map<string, L.Icon>();
  private colorIndex = 0;

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.currentUserValue;
    if (this.user?.role === 'Analista' || this.user?.role === 'Admin') {
      this.loadSummary();
    } else {
      this.isLoading = false;
    }
  }

  loadSummary(): void {
    this.dashboardService.getSummary().subscribe({
      next: (data) => {
        this.summaryData = data;
        this.severityChartData = data.reportsBySeverity.map(item => ({ name: item._id, value: item.count }));
        this.sourceChartData = data.reportsBySource.map(item => ({ name: item._id, value: item.count }));
        this.genderChartData = data.reportsByGender.map(item => ({ name: item._id === 'M' ? 'Maschile' : 'Femminile', value: item.count }));

        this.isLoading = false;

        this.addMarkersToMap();
        this.addHeatLayerToMap();
      },
      error: (err) => {
        this.error = 'Impossibile caricare i dati della dashboard.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  private initMarkerMap(container: HTMLElement): void {
    if (this.markerMap || container.offsetHeight === 0) return;

    this.markerMap = L.map(container).setView([42.5, 12.5], 5.5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.markerMap);

    setTimeout(() => this.markerMap?.invalidateSize(), 100);

    this.addMarkersToMap();
  }

  private initHeatmap(container: HTMLElement): void {
    if (this.heatmap || container.offsetHeight === 0) return;

    this.heatmap = L.map(container).setView([42.5, 12.5], 5.5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.heatmap);

    setTimeout(() => this.heatmap?.invalidateSize(), 100);

    this.addHeatLayerToMap();
    this.addHeatmapLegend();
  }

  private getIconForDrug(drugName: string): L.Icon {
    if (this.drugIconMap.has(drugName)) {
      return this.drugIconMap.get(drugName)!;
    }

    const color = this.markerColors[this.colorIndex % this.markerColors.length];
    this.colorIndex++;

    const newIcon = L.icon({
      iconUrl: `assets/marker-${color}.png`,
      shadowUrl: 'assets/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    this.drugIconMap.set(drugName, newIcon);
    return newIcon;
  }

  private addMarkersToMap(): void {
    if (!this.markerMap || !this.summaryData?.reportLocations) return;

    this.markerMap.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        this.markerMap?.removeLayer(layer);
      }
    });

    this.summaryData.reportLocations.forEach(report => {
      if(report.localita?.coordinates) {
        const [lon, lat] = report.localita.coordinates;
        const drugName = report.farmaciSospetti[0]?.nomeCommerciale || 'N/D';
        if (lat && lon) {
          L.marker([lat, lon], {
            icon: this.getIconForDrug(drugName)
          })
            .addTo(this.markerMap as L.Map)
            .bindPopup(`<b>${drugName}</b>`);
        }
      }
    });

    this.updateMarkerMapLegend();
  }

  private updateMarkerMapLegend(): void {
    if (this.markerLegendControl) {
      this.markerMap?.removeControl(this.markerLegendControl);
    }

    const legend = new L.Control({ position: 'bottomright' });

    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'info legend');
      let content = '<h4>Legenda Farmaci</h4>';

      this.drugIconMap.forEach((icon, drugName) => {
        const color = icon.options.iconUrl?.match(/marker-(.*)\.png/)?.[1] || 'gray';
        content += `<div><i style="background:${color}"></i> ${drugName}</div>`;
      });

      div.innerHTML = content;
      return div;
    };

    if (this.markerMap) {
      this.markerLegendControl = legend.addTo(this.markerMap);
    }
  }

  private addHeatLayerToMap(): void {
    if (!this.heatmap || !this.summaryData?.reportLocations) return;
    if (this.heatLayer) {
      this.heatmap.removeLayer(this.heatLayer);
    }

    const points = this.summaryData.reportLocations
      .filter(report => report.localita?.coordinates)
      .map(report => {
        const [lon, lat] = report.localita.coordinates;
        let intensity = 0.5;
        if (report.reazione.gravita.isGrave) intensity = 1.0;
        return [lat, lon, intensity];
      });

    this.heatLayer = (L as any).heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 12
    }).addTo(this.heatmap);
  }

  private addHeatmapLegend(): void {
    if (this.heatmapLegendControl) {
      this.heatmap?.removeControl(this.heatmapLegendControl);
    }

    const legend = new L.Control({ position: 'bottomright' });

    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'info legend heatmap-legend');
      div.innerHTML =
        '<h4>Intensità Segnalazioni</h4>' +
        '<div class="gradient-bar"></div>' +
        '<div class="labels"><span>Bassa</span><span>Alta</span></div>';
      return div;
    };

    if (this.heatmap) {
      this.heatmapLegendControl = legend.addTo(this.heatmap);
    }
  }
}
