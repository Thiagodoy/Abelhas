import { animate, Component, ElementRef, EventEmitter, Input, keyframes, OnChanges,
  OnInit, Output, Renderer, SimpleChange, state, style, transition, trigger} from '@angular/core';

import {Calendar} from './calendar';  

@Component({
  selector: 'app-data-picker-custom',
  templateUrl: './data-picker-custom.component.html',
  styleUrls: ['./data-picker-custom.component.scss'],
   animations: [
    trigger('calendarAnimation', [
      transition('* => left', [
        animate(180, keyframes([
          style({ transform: 'translateX(105%)', offset: 0.5 }),
          style({ transform: 'translateX(-130%)', offset: 0.51 }),
          style({ transform: 'translateX(0)', offset: 1 })
        ]))
      ]),
      transition('* => right', [
        animate(180, keyframes([
          style({ transform: 'translateX(-105%)', offset: 0.5 }),
          style({ transform: 'translateX(130%)', offset: 0.51 }),
          style({ transform: 'translateX(0)', offset: 1 })
        ]))
      ])
    ])
  ],
})

export class DataPickerCustomComponent implements OnInit, OnChanges {

  private dateVal: Date;

  // two way bindings
  @Output() dateChange = new EventEmitter<Date>();

  @Input() get date(): Date { return this.dateVal; };
  set date(val: Date) {
    this.dateVal = val;
    this.dateChange.emit(val);
  }

  // api bindings
  @Input() disabled: boolean;
  @Input() accentColor: string;
  @Input() altInputStyle: boolean;
  @Input() dateFormat: string;
  @Input() fontFamily: string;
  @Input() rangeStart: Date;
  @Input() rangeEnd: Date;
  // data
  @Input() placeholder: string = 'Select a date';
  @Input() inputText: string;
  // view logic
  @Input() showCalendar: boolean;
  // events
  @Output() onSelect = new EventEmitter<Date>();
  // time
  @Input() calendarDays: Array<number>;
  @Input() currentMonth: string;
  @Input() dayNames: Array<String>;
  @Input() hoveredDay: Date;
  calendar: Calendar;
  currentMonthNumber: number;
  currentYear: number;
  months: Array<string>;
  // animation
  animate: string;
  // colors
  colors: { [id: string]: string };
  // listeners
  clickListener: Function;


  constructor(private renderer: Renderer, private elementRef: ElementRef) {
    this.dateFormat = 'YYYY-MM-DD';
    // view logic
    this.showCalendar = false;
    // colors
    this.colors = {
      'black': '#333333',
      'blue': '#1285bf',
      'lightGrey': '#f1f1f1',
      'white': '#ffffff'
    };
    this.accentColor = this.colors['blue'];
    this.altInputStyle = false;
    // time
    this.calendar = new Calendar();
    this.dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
    this.months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
      'Agosto', 'Setembro', 'Outubro', 'Novembro', ' Dezembro'
    ];
    // listeners
    this.clickListener = renderer.listenGlobal('document', 'click', (event: MouseEvent) => this.handleGlobalClick(event));
  }

  ngOnInit() {
    this.setDate();
  }

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    if ((changes['date'] || changes['dateFormat'])) {
      this.setDate();
    }
  }

  ngOnDestroy() {
    this.clickListener();
  }

  // State Management
  // ------------------------------------------------------------------------------------
  closeCalendar(): void {
    this.showCalendar = false;
    this.setDate();
  }

  private setCurrentValues(date: Date) {
    this.currentMonthNumber = date.getMonth();
    this.currentMonth = this.months[this.currentMonthNumber];
    this.currentYear = date.getFullYear();
    const calendarArray = this.calendar.monthDays(this.currentYear, this.currentMonthNumber);
    this.calendarDays = [].concat.apply([], calendarArray);
  }

  setDate(): void {
    if (this.date) {
      this.setInputText(this.date);
      this.setCurrentValues(this.date);
    }
    else {
      this.inputText = '';
      this.setCurrentValues(new Date());
    }
  }

  setCurrentMonth(monthNumber: number) {
    this.currentMonth = this.months[monthNumber];
    const calendarArray = this.calendar.monthDays(this.currentYear, this.currentMonthNumber);
    this.calendarDays = [].concat.apply([], calendarArray);
  }

  setHoveredDay(day: Date): void {
    this.hoveredDay = day;
  }

  removeHoveredDay(day: Date): void {
    this.hoveredDay = null;
  }

  setInputText(date: Date): void {
    let month: string = (date.getMonth() + 1).toString();
    if (month.length < 2) {
      month = `0${month}`;
    }
    let day: string = (date.getDate()).toString();
    if (day.length < 2) {
      day = `0${day}`;
    }

    let inputText: string;
    switch (this.dateFormat.toUpperCase()) {
      case 'YYYY-MM-DD':
        inputText = `${date.getFullYear()}/${month}/${day}`;
        break;
      case 'MM-DD-YYYY':
        inputText = `${month}/${day}/${date.getFullYear()}`;
        break;
      case 'DD-MM-YYYY':
        inputText = `${day}/${month}/${date.getFullYear()}`;
        break;
      default:
        inputText = `${date.getFullYear()}/${month}/${day}`;
        break;
    }

    this.inputText = inputText;
  }

  // Click Handlers
  // ------------------------------------------------------------------------------------
  onArrowLeftClick(): void {
    const currentMonth: number = this.currentMonthNumber;
    let newYear: number = this.currentYear;
    let newMonth: number;

    if (currentMonth === 0) {
      newYear = this.currentYear - 1;
      newMonth = 11;
    } else {
      newMonth = currentMonth - 1;
    }

    let newDate = new Date(newYear, newMonth);
    if (!this.rangeStart || newDate.getTime() >= this.rangeStart.getTime()) {
      this.currentYear = newYear;
      this.currentMonthNumber = newMonth;
      this.setCurrentMonth(newMonth);
      this.triggerAnimation('left');
    }
  }

  onArrowRightClick(): void {
    const currentMonth: number = this.currentMonthNumber;
    let newYear: number = this.currentYear;
    let newMonth: number;

    if (currentMonth === 11) {
      newYear = this.currentYear + 1;
      newMonth = 0;
    } else {
      newMonth = currentMonth + 1;
    }

    let newDate = new Date(newYear, newMonth);
    if (!this.rangeEnd || newDate.getTime() <= this.rangeEnd.getTime()) {
      this.currentYear = newYear;
      this.currentMonthNumber = newMonth;
      this.setCurrentMonth(newMonth);
      this.triggerAnimation('right');
    }
  }

  onCancel(): void {
    this.closeCalendar();
  }

  onInputClick(): void {
    this.showCalendar = !this.showCalendar;
  }

  onSelectDay(day: Date): void {
    this.date = day;
    this.onSelect.emit(day);
    this.showCalendar = !this.showCalendar;
  }

  // Listeners
  // ------------------------------------------------------------------------------------
  handleGlobalClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeCalendar();
    }
  }

  // Helpers
  // ------------------------------------------------------------------------------------
  getDayBackgroundColor(day: Date): string {
    let color = this.colors['white'];
    if (this.isChosenDay(day)) {
      color = this.accentColor;
    } else if (this.isCurrentDay(day)) {
      color = this.colors['lightGrey'];
    }
    return color;
  }

  getDayFontColor(day: Date): string {
    let color = this.colors['black'];
    if (this.isChosenDay(day)) {
      color = this.colors['white'];
    }
    return color;
  }

  isChosenDay(day: Date): boolean {
    if (day) {
      return this.date ? day.toDateString() == this.date.toDateString() : false;
    } else {
      return false;
    }
  }

  isCurrentDay(day: Date): boolean {
    if (day) {
      return day.toDateString() == new Date().toDateString();
    } else {
      return false;
    }
  }

  isHoveredDay(day: Date): boolean {
    return this.hoveredDay ? this.hoveredDay == day && !this.isChosenDay(day) : false;
  }

  triggerAnimation(direction: string): void {
    this.animate = direction;
    setTimeout(() => this.animate = 'reset', 185);
  }
}

