import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Applet, LibraryComponent, lib } from './library.component';
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
    // Set the search query to 'CMS'
    component.searchQuery = 'CMS';
    // For each filtered applet, check if the name contains the search query
    component.filteredApplets.forEach((applet) => {
      expect(applet.name.toLowerCase()).toContain(
        component.searchQuery.toLowerCase()
      );
    });
  });

  it('should filter applets by name; should not contain something else', () => {
    // Set the search query to 'Performance Snapshot'
    component.searchQuery = 'Performance Snapshot';
    // For each filtered applet, check if the name does not contain 'CMS' (case-insensitive)
    component.filteredApplets.forEach((applet) => {
      expect(applet.name.toLowerCase()).not.toContain('CMS'.toLowerCase());
    });
  });

  it('should return the correct count of applets for a category', () => {
    const category = 'Performance';
    const count = component.getCategoryCount(category);

    const applets: Applet[] = !component.searchQuery
      ? lib.applets
      : component.filteredApplets;

    // Filter applets based on the category
    const filteredApplets = applets.filter((applet) =>
      applet.categories.includes(category)
    );
    // Expect the category count to be equal to the length of filtered applets count
    expect(count).toEqual(filteredApplets.length);
  });

  it('should reset selected category and search query', () => {
    component.resetValues();
    expect(component.selectedCategory).toEqual('');
    expect(component.searchQuery).toEqual('');
  });

  it('should filter categories to only include the ones that contain applets matching search; should not show category that have 0 applets when search is present', () => {
    // Set the search query to 'Performance Snapshot'
    component.searchQuery = 'Performance Snapshot';
    // Expect the filtered categories to have a size of 1 and contain 'Performance', but not 'Operations'
    expect(component.filteredCategories).toHaveSize(1);
    expect(component.filteredCategories).toContain('Performance');
    expect(component.filteredCategories).not.toContain('Operations');
  });
});
