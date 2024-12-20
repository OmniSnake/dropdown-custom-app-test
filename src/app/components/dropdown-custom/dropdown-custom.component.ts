import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexedDBService } from '../../services/indexeddb.service';
import { Category } from '../../modeles/category.model';
import { Item } from '../../modeles/item.model';
import { signal, computed } from '@angular/core';

@Component({
  selector: 'app-dropdown-custom',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown-custom.component.html',
  styleUrls: ['./dropdown-custom.component.scss'],
})
export class DropdownCustomComponent implements OnInit {
  public categories = signal<Category[]>([]);
  public isListOpen = signal<boolean>(false);
  
  public selectedFunnels = computed(() =>
    this.categories().filter(cat => cat.isSelected).length
  );
  public selectedStages = computed(() =>
    this.categories().flatMap(cat => cat.items).filter(item => item.isSelected).length
  );

  public isAllSelected = computed(() => 
    this.categories().every(cat => cat.isSelected && cat.items.every(item => item.isSelected))
  );

  private colors: string[] = ['item-color-1', 'item-color-2', 'item-color-3', 'item-color-4'];

  constructor(private indexedDBService: IndexedDBService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  private async loadCategories(): Promise<void> {
    const savedCategories = await this.indexedDBService.getSelections();
    if (savedCategories) {
      this.categories.set(savedCategories);
    } else {
      this.categories.set(this.getDefaultCategories());
    }
  }

  private getDefaultCategories(): Category[] {
    return [
      {
        id: 1,
        name: 'Продажи',
        isExpanded: false,
        isSelected: false,
        items: [
          { id: 1, name: 'Неразобранное', isSelected: false },
          { id: 2, name: 'Переговоры', isSelected: false },
          { id: 3, name: 'Принимают решение', isSelected: false },
          { id: 4, name: 'Успешно', isSelected: false },
        ],
      },
      {
        id: 2,
        name: 'Сотрудники',
        isExpanded: false,
        isSelected: false,
        items: [
          { id: 5, name: 'Неразобранное', isSelected: false },
          { id: 6, name: 'Переговоры', isSelected: false },
          { id: 7, name: 'Принимают решение', isSelected: false },
          { id: 8, name: 'Успешно', isSelected: false },
        ],
      },
      {
        id: 3,
        name: 'Партнёры',
        isExpanded: false,
        isSelected: false,
        items: [
          { id: 9, name: 'Неразобранное', isSelected: false },
          { id: 10, name: 'Переговоры', isSelected: false },
          { id: 11, name: 'Принимают решение', isSelected: false },
          { id: 12, name: 'Успешно', isSelected: false },
        ],
      },
      {
        id: 4,
        name: 'Ивент',
        isExpanded: false,
        isSelected: false,
        items: [
          { id: 13, name: 'Неразобранное', isSelected: false },
          { id: 14, name: 'Переговоры', isSelected: false },
          { id: 15, name: 'Принимают решение', isSelected: false },
          { id: 16, name: 'Успешно', isSelected: false },
        ],
      },
      {
        id: 5,
        name: 'Входящие сообщения',
        isExpanded: false,
        isSelected: false,
        items: [
          { id: 17, name: 'Неразобранное', isSelected: false },
          { id: 18, name: 'Переговоры', isSelected: false },
          { id: 19, name: 'Принимают решение', isSelected: false },
          { id: 20, name: 'Успешно', isSelected: false },
        ],
      },
    ];
  }

  public toggleList(): void {
    this.isListOpen.set(!this.isListOpen());
  }

  public toggleCategorySelection(categoryId: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const updatedCategories = this.categories().map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          isSelected: checked,
        };
      }
      return cat;
    });
    this.categories.set(updatedCategories);
    this.saveSelections();
  }

  public toggleCategoryExpansion(categoryId: number): void {
    const updatedCategories = this.categories().map(cat =>
      cat.id === categoryId
        ? {
            ...cat,
            isExpanded: !cat.isExpanded,
          }
        : cat
    );
    this.categories.set(updatedCategories);
  }

  public toggleItem(categoryId: number, itemId: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const updatedCategories = this.categories().map(cat => {
      if (cat.id === categoryId) {
        const updatedItems = cat.items.map(item =>
          item.id === itemId ? { ...item, isSelected: checked } : item
        );
        return { ...cat, items: updatedItems };
      }
      return cat;
    });
    this.categories.set(updatedCategories);
    this.saveSelections();
  }

  public toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const updatedCategories = this.categories().map(cat => ({
      ...cat,
      isSelected: checked,
      items: cat.items.map(item => ({
        ...item,
        isSelected: checked,
      })),
    }));
    this.categories.set(updatedCategories);
    this.saveSelections();
  }

  public closeList(): void {
    this.isListOpen.set(false);
  }

  private async saveSelections(): Promise<void> {
    await this.indexedDBService.saveSelections(this.categories());
  }

  @HostListener('document:click', ['$event'])
  public handleClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.dropdown-container');
    if (!clickedInside) {
      this.closeList();
    }
  }

  public isAllItemsSelected(category: Category): boolean {
    return category.items.every(item => item.isSelected);
  }

  public getItemBackgroundClass(item: Item): string {
    const colorIndex = (item.id - 1) % this.colors.length;
    return this.colors[colorIndex];
  }

  public trackByCategoryId(index: number, category: Category): number {
    return category.id;
  }

  public trackByItemId(index: number, item: Item): number {
    return item.id;
  }
}