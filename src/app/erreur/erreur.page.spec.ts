import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ErreurPage } from './erreur.page';

describe('ErreurPage', () => {
  let component: ErreurPage;
  let fixture: ComponentFixture<ErreurPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErreurPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ErreurPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
