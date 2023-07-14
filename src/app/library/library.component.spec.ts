import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryComponent } from './library.component';
import { FormsModule } from '@angular/forms';

describe('LibraryComponent', () => {
  let component: LibraryComponent;
  let fixture: ComponentFixture<LibraryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LibraryComponent],
      imports: [FormsModule],
    });
    fixture = TestBed.createComponent(LibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter applets by name; should contain', () => {
    component.searchQuery = 'CMS';
    component.filteredApplets.forEach((applet) => {
      expect(applet.name.toLowerCase()).toContain(
        component.searchQuery.toLowerCase()
      );
    });
  });

  it('should filter applets by name; should not contain something else', () => {
    component.searchQuery = 'Performance Snapshot';
    component.filteredApplets.forEach((applet) => {
      expect(applet.name.toLowerCase()).not.toContain('CMS'.toLowerCase());
    });
  });

  it('should return the correct count of applets for a category', () => {
    const category = 'Performance';
    const count = component.getCategoryCount(category);
    const filteredApplets = component.filteredApplets.filter((applet) =>
      applet.categories.includes(category)
    );
    expect(count).toEqual(filteredApplets.length);
  });

  it('should reset selected category and search query', () => {
    component.resetValues();
    expect(component.selectedCategory).toEqual('');
    expect(component.searchQuery).toEqual('');
  });

  it('should filter categories to only include the ones that contain applets matching search; should not show category that have 0 applets when search is present', () => {
    component.searchQuery = 'Performance Snapshot';
    expect(component.filteredCategories).toHaveSize(1);
    expect(component.filteredCategories).toContain('Performance');
    expect(component.filteredCategories).not.toContain('Operations');
  });
});
