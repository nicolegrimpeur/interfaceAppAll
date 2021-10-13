import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModificationsPage } from './modifications.page';

describe('ModificationsPage', () => {
  let component: ModificationsPage;
  let fixture: ComponentFixture<ModificationsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificationsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModificationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
