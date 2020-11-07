import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, pluck, switchMap } from 'rxjs/operators';
import { SearchService } from '../service/search.service';
import { CardData } from '../models/Card';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit, AfterViewInit {

  @ViewChild('searchForm') searchForm: NgForm;
  searchResults: CardData;
  constructor(private _searchService: SearchService) { 
  }

  public cards: CardData;
  public showSpinner: boolean;
  private _itemsToLoadInitially: number = 20;
  private _cardsToLoad: number = 20;
  public page: number = 1;
  public searchResult: any = '';

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.getCards();
  }

  public getCards() {
    // getting the typed value in the textbox as a observable 
    const formValue = this.searchForm.valueChanges;
    formValue.pipe(
      pluck('search'),
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap(res => this._searchService.getSearchResults(res))
    ).subscribe(res => {
      this.searchResults = res.cards;
      this.searchResults = res.cards.slice(0, this._itemsToLoadInitially);
    })
  }

  // public onScroll() {
  //   this._cardService.getCards().subscribe(cards => {
  //     if(this._itemsToLoadInitially <= cards.length) {
  //       this._itemsToLoadInitially += this._cardsToLoad;
  //       this.cards = cards.slice(0, this._itemsToLoadInitially);
  //     }
  //   })
  //   this.getCards();  
  // }
}
