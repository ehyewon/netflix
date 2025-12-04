import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class RecentSearchService {

    private STORAGE_KEY = 'recent-searches';
    private MAX_LENGTH = 10; // 최근 검색어 최대 10개 저장

    constructor() { }

    // 🔍 최근 검색어 목록 불러오기
    getRecentKeywords(): string[] {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    }

    // 🔍 검색어 추가 (중복 제거 + 최신순 정렬)
    addKeyword(keyword: string): void {
        keyword = keyword.trim();
        if (!keyword) return;

        let list = this.getRecentKeywords();

        // 기존에 있던 검색어는 삭제
        list = list.filter(k => k !== keyword);

        // 최신 검색어 맨 앞에 추가
        list.unshift(keyword);

        // 최대 길이 제한
        if (list.length > this.MAX_LENGTH) {
            list = list.slice(0, this.MAX_LENGTH);
        }

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
    }

    // 🔍 전체 삭제
    clearKeywords(): void {
        localStorage.removeItem(this.STORAGE_KEY);
    }
}
