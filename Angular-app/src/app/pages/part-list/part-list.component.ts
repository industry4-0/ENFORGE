import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TaskService } from 'src/app/services/tasks/task.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { manufacturingPlans } from 'src/app/models/plan.model';
@Component({
  selector: 'app-part-list',
  templateUrl: './part-list.component.html',
  styleUrls: ['./part-list.component.scss'],
    animations: [
      trigger('fadeInOut', [
        state('init', style({
          opacity: 0
        })),
        state('final', style({
          opacity: 0
        })),
        transition('init => final', animate(800))
      ])
  ]
})
export class PartListComponent implements OnInit {
  plans: manufacturingPlans[];
  dataSource = new MatTableDataSource();
  private sort: MatSort;
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setSort();
  }
  displayedColumns: string[] = ['name', 'Item Code', 'quantity'];
  constructor(public taskService: TaskService) { }

  ngOnInit() {
    this.taskService.getPlans().subscribe((plans: manufacturingPlans[]) => 
      this.plans = plans
      .filter(plan => plan.statusHistory[plan.statusHistory.length - 1].status !== 'Draft')
      .reverse()
    )
  }

  setSort(){
    this.dataSource.sort = this.sort;
  }
  onSelect(plan_id: string) {
    this.taskService.getPartList(plan_id).subscribe(bom => {
      this.dataSource = new MatTableDataSource(this.hash(bom.parts));
      this.dataSource.sort = this.sort;
    })
  }

  hash(data) {
    let newItemArray = [];
    data.forEach(item => {
      let newItem: any = {};
      newItem['name'] = item.name;
      newItem['quantity'] = item.quantity;
      newItem['id'] = item.id;
      newItem['Item Code'] = item.itemCode;
      item.params.forEach(p => {
        if ((!this.displayedColumns.includes(p.name)) && (p.name != 'designTypes')) {
          /* initialize checkbox names and column names */
          this.displayedColumns.push(p.name);
        }
        newItem[p.name] = p.value;
      })
      newItemArray.push(newItem)
    })
    return newItemArray;
  }
}