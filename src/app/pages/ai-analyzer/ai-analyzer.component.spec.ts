import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiAnalyzerComponent } from './ai-analyzer.component';

describe('AiAnalyzerComponent', () => {
  let component: AiAnalyzerComponent;
  let fixture: ComponentFixture<AiAnalyzerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AiAnalyzerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AiAnalyzerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
