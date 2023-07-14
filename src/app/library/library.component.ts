import { Component } from '@angular/core';

interface Applet {
  name: string;
  categories: string[];
}

const lib: {
  categories: string[];
  applets: { name: string; categories: string[] }[];
} = {
  categories: ['Performance', 'Investments', 'Operations'],
  applets: [
    { name: 'Performance Snapshot', categories: ['Performance'] },
    { name: 'Commitment Widget', categories: ['Investments'] },
    { name: 'CMS', categories: ['Investments', 'Performance'] },
  ],
};

function addBigData(
  lib: {
    categories: string[];
    applets: { name: string; categories: string[] }[];
  },
  ncategs: number,
  napplets: number
) {
  for (var i = 0; i < ncategs; i++) {
    lib.categories.push('Sample Category ' + i);
  }
  var n = lib.categories.length;
  for (var i = 0; i < napplets; i++) {
    var a = {
      name: 'CMS' + i,
      categories: [] as string[],
    };
    for (var j = 0; j < Math.floor(Math.random() * 10); ++j) {
      var idx = Math.floor(Math.random() * n) % n;
      a.categories.push(lib.categories[idx]);
    }
    lib.applets.push(a);
  }
}
addBigData(lib, 100, 5000);

/*
  AddBigData introduces 'lag' because it possibly increases the number of iterations needed to compute when filtering a category or searching for applets.
  I can reduce it by optimizing the filtering and sorting functions with a search index or maybe use an array that already has been pre-sorted. 
  I can also possibly implement caching for search results that are used often, adding an expiration timer to those cached results so that less 
  frequently used queries don't take up memory. Additionally, I can introduce pagination into the HTML and implement lazy loading to fetch only the data I would need.
*/

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
})
export class LibraryComponent {
  selectedCategory: string = '';
  searchQuery: string = '';

  // pagination details
  currentAppletPage: number = 1;
  totalApplets: number = 0;

  get filteredApplets(): Applet[] {
    let applets = lib.applets;

    if (this.searchQuery) {
      applets = applets.filter((applet) =>
        applet.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else if (this.selectedCategory) {
      applets = applets.filter((applet) =>
        applet.categories.includes(this.selectedCategory)
      );
    }

    this.totalApplets = applets.length;

    const pageSize = 10;
    const startIndex = (this.currentAppletPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const paginatedApplets = applets.slice(startIndex, endIndex);
    return paginatedApplets.sort();
  }

  get filteredCategories(): string[] {
    const categories: Set<string> = new Set<string>();

    // if no search query is provided, include all categories from the library
    if (!this.searchQuery) {
      lib.categories.forEach((category) => categories.add(category));
    } else {
      // if search query is provided, include only categories of matching applets
      this.filteredApplets.forEach((applet) => {
        applet.categories.forEach((category) => categories.add(category));
      });
    }

    return Array.from(categories).sort();
  }

  getCategoryCount(category: string): number {
    const applets = !this.searchQuery ? lib.applets : this.filteredApplets;
    let count = 0;

    for (const applet of applets) {
      if (applet.categories.includes(category)) {
        count++;
      }
    }

    return count;
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  resetValues(): void {
    this.selectedCategory = '';
    this.searchQuery = '';
  }

  goToPreviousAppletPage(): void {
    if (this.currentAppletPage > 1) {
      this.currentAppletPage--;
    }
  }

  goToNextAppletPage(): void {
    const totalPages = Math.ceil(this.totalApplets / 10);
    if (this.currentAppletPage < totalPages) {
      this.currentAppletPage++;
    }
  }
}
