import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent {
  @Input() totalPages: number;
  @Input() currentPage: number;
  @Input() pageSizeOptions: number[];
  @Input() pageSize: number;
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  getPaginationArray(): number[] {
    if (!this.totalPages) return [];

    if (this.totalPages <= 2) {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    let startPage: number;
    let endPage: number;

    if (this.currentPage <= 2) {
      startPage = 1;
      endPage = 2;
    } else if (this.currentPage >= this.totalPages - 1) {
      startPage = this.totalPages - 1;
      endPage = this.totalPages;
    } else {
      startPage = this.currentPage - 1;
      endPage = this.currentPage + 1;
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }

  goToPage(pageNumber: number): void {
    this.pageChange.emit(pageNumber);
  }

  goToFirstPage(): void {
    this.goToPage(1);
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  goToLastPage(): void {
    this.goToPage(this.totalPages);
  }

  changePageSize(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const newSize = Number(selectElement.value);
    this.pageSizeChange.emit(newSize);
  }
}
