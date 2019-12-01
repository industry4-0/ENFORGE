import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StockService } from 'src/app/services/stock/stock.service';
import { MatPaginator } from '@angular/material/paginator';
import { trigger, state, style, animate, transition } from '@angular/animations';
@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(800)),
    ]),
    trigger('fadeInPag', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate('0.4s 600ms')),
    ]),
  ]
})
export class StockComponent implements OnInit {
  displayedColumns = ['name', 'itemCode', 'type', 'quantity', 'commited', 'available', 'reorder', 'makeorbuy'];
  editQuantity: Array<boolean>;
  editReorder: Array<boolean>;
  quantity: Array<number>;
  reorder: Array<number>;
  dataSource: any;
  temp: Array<string> = [];
  showMaterial: boolean;
  currentState: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private stockService: StockService,
    private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getStock()
    this.currentState = 'initial'
  }

  getStock() {
    this.quantity = [];
    this.editQuantity = [];
    this.reorder = [];
    this.editReorder = [];
    this.stockService.getStockData()
      .subscribe((data: any[]) => {
        if (data) {
          const sortedData = data.reverse()
          sortedData.forEach(item => {
            this.editQuantity.push(false);
            this.quantity.push(item.quantity)
            this.editReorder.push(false);
            this.reorder.push(item.reorder)
            if (item.params)
              item.params.forEach(param => {
                if (param.name != 'designTypes')
                  if (!this.displayedColumns.includes(param.name)) {
                    this.displayedColumns.push(param.name)
                    this.temp.push(param.name)
                  }
              })
          })
          if (this.displayedColumns.includes('actions'))
            this.displayedColumns.splice(this.displayedColumns.indexOf('actions'), 1)
          this.displayedColumns.push('actions')
          this.dataSource = new MatTableDataSource(sortedData);
          this.dataSource.paginator = this.paginator;
        }
      })
  }

  updateStockAll() {
    const stockItems = this.dataSource.data;
    let updatedItem = { id: null, quantity: null, reorder: null };
    let itemsToUpdate = [];
    for (let i = 0; i < stockItems.length; i++) {
      if ((stockItems[i].quantity != this.quantity[i]) || (stockItems[i].reorder != this.reorder[i])) {
        updatedItem['quantity'] = this.quantity[i]
        updatedItem['id'] = stockItems[i].id
        updatedItem['reorder'] = this.reorder[i]
        itemsToUpdate.push(updatedItem)
      }
    }
    if (itemsToUpdate.length)
      this.stockService.updateStockAll(itemsToUpdate)
        .subscribe(() => this.messageNrefresh())
  }

  updateStockItem(itemToUpdate: any, index: number) {
    itemToUpdate['quantity'] = this.quantity[index]
    itemToUpdate['reorder'] = this.reorder[index]
    this.stockService.updateStockItem(itemToUpdate)
      .subscribe(() => this.messageNrefresh())
  }

  messageNrefresh() {
    this._snackBar.open('Stock Updated', 'Ok', {
      duration: 3000,
      panelClass: ['success']
    });
    this.getStock();
  }

  displayFn(event) {
    this.showMaterial = event ? true : false
  }
}