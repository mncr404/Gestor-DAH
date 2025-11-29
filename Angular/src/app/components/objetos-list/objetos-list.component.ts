import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ObjetoService, ObjetoDto } from 'src/app/services/objeto.service';

@Component({
  selector: 'app-objetos-list',
  templateUrl: './objetos-list.component.html'
})
export class ObjetosListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  search = new FormControl('');
  items: ObjetoDto[] = [];
  total = 0;
  pageSize = 24;

  loading = false;

  constructor(private api: ObjetoService) {}

  ngOnInit(): void {
    this.load(1);
    this.search.valueChanges.pipe(debounceTime(350), distinctUntilChanged())
      .subscribe(() => this.load(1));
  }

  load(page: number) {
    this.loading = true;
    this.api.listar(page, this.pageSize, this.search.value || '')
      .subscribe({
        next: (r) => { this.items = r.items || []; this.total = r.total || this.items.length; },
        complete: () => this.loading = false
      });
  }

  pageChange(e: any) { this.pageSize = e.pageSize; this.load(e.pageIndex + 1); }
}

