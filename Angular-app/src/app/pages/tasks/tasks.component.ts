import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { takeUntil, startWith, switchMap } from 'rxjs/operators';
import { interval, Subject } from 'rxjs';
import { TaskService } from 'src/app/services/tasks/task.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { manufacturingPlans } from 'src/app/models/plan.model';
@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(800))
    ])
]
})
export class TasksComponent implements OnInit, OnDestroy {
  currentState = 'initial';
  private unsubscribe$ = new Subject;
  displayedColumns = ['title', 'station','quantity','made','status','itemCode', 'type'];
  plans:  manufacturingPlans[];
  selected: any;
  dataSource: any;
  temp: Array<string> = []
  @ViewChild(MatSort) sort: MatSort;
  constructor(public taskService: TaskService) { }

  ngOnInit() {
    this.taskService.getPlans().subscribe((plans: manufacturingPlans[]) => 
    this.plans = plans
    .filter(plan => plan.statusHistory[plan.statusHistory.length - 1].status !== 'Draft')
    .reverse()
    )
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onSelect(plan_id: string) {
    this.currentState = 'final'
    /*Stop last pollin each time user selects different plan */
    this.unsubscribe$.next();
    interval(2000)
      .pipe(
        startWith(0),
        takeUntil(this.unsubscribe$),
        switchMap(() => this.taskService.getTasksByPlan(plan_id))
      ).subscribe(tasks => {
        if (tasks)
          tasks.forEach(task => {
            if (task.params)
              task.params.forEach(param => {
                if (param.name != 'designTypes')
                  if (!this.displayedColumns.includes(param.name)) {
                    this.displayedColumns.push(param.name)
                    this.temp.push(param.name)
                  }
              })
          })
        this.dataSource = new MatTableDataSource(tasks);
        this.dataSource.sort = this.sort;
      })
  }
}