import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderContactLinksComponent } from './header-contact-links.component';

describe('HeaderContactLinksComponent', () => {
  let component: HeaderContactLinksComponent;
  let fixture: ComponentFixture<HeaderContactLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderContactLinksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderContactLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
