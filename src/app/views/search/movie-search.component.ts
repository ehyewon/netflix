import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchOptions } from '../../../models/types';
import { RecentSearchService } from '../../util/recent-search.service';

type DropdownKey = 'originalLanguage' | 'translationLanguage' | 'sorting';

@Component({
  selector: 'app-movie-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movie-search.component.html',
  styleUrls: ['./movie-search.component.css']
})
export class MovieSearchComponent {

  /* -------------------------------
      🔥 부모에게 전달하는 이벤트들
  ------------------------------- */
  @Output() changeOptions = new EventEmitter<SearchOptions>();
  @Output() keywordChanged = new EventEmitter<string>();

  /* -------------------------------
      🔥 검색창 입력 값 & 최근 검색어
  ------------------------------- */
  keywordInput: string = '';
  recentKeywords: string[] = [];

  constructor(private recentSearch: RecentSearchService) { }

  /* -------------------------------
      🔥 드롭다운 옵션들
  ------------------------------- */
  readonly dropdowns: Record<DropdownKey, string[]> = {
    originalLanguage: ['장르 (전체)', 'Action', 'Adventure', 'Comedy', 'Crime', 'Family'],
    translationLanguage: ['평점 (전체)', '9~10', '8~9', '7~8', '6~7', '5~6', '4~5', '4점 이하'],
    sorting: ['언어 (전체)', '영어', '한국어']
  };

  readonly DEFAULT_OPTIONS: SearchOptions = {
    originalLanguage: '장르 (전체)',
    translationLanguage: '평점 (전체)',
    sorting: '언어 (전체)'
  };

  selectedOptions: SearchOptions = { ...this.DEFAULT_OPTIONS };
  activeDropdown: DropdownKey | null = null;

  /* -------------------------------
      ⭐ dropdownEntries — 오류 원인 해결
  ------------------------------- */
  get dropdownEntries() {
    return Object.entries(this.dropdowns).map(([key, options]) => ({
      key: key as DropdownKey,
      options
    }));
  }

  /* -------------------------------
      🔥 드롭다운 토글 / 옵션 선택
  ------------------------------- */
  toggleDropdown(key: DropdownKey): void {
    this.activeDropdown = this.activeDropdown === key ? null : key;
  }

  selectOption(key: DropdownKey, option: string): void {
    this.selectedOptions = { ...this.selectedOptions, [key]: option };
    this.activeDropdown = null;
    this.changeOptions.emit(this.selectedOptions);
  }

  clearOptions(): void {
    this.selectedOptions = { ...this.DEFAULT_OPTIONS };
    this.changeOptions.emit(this.selectedOptions);
  }

  /* -------------------------------
      🔥 검색어 입력 시 → 영화 즉시 필터링
  ------------------------------- */
  onInput(): void {
    this.keywordChanged.emit(this.keywordInput);
  }

  /* -------------------------------
      🔥 엔터 또는 검색 버튼 → 최근 검색어 저장
  ------------------------------- */
  submitSearch(): void {
    if (this.keywordInput.trim().length === 0) return;

    this.recentSearch.addKeyword(this.keywordInput);
    this.recentKeywords = this.recentSearch.getRecentKeywords();
  }

  /* -------------------------------
      🔥 최근 검색어 클릭 시 자동 검색
  ------------------------------- */
  selectRecent(word: string): void {
    this.keywordInput = word;
    this.keywordChanged.emit(word);
  }

  /* -------------------------------
      🔥 컴포넌트 로드시 최근 검색어 로드
  ------------------------------- */
  ngOnInit() {
    this.recentKeywords = this.recentSearch.getRecentKeywords();
  }
}
