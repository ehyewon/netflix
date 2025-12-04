import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-banner',
  standalone: true,
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css'],
  imports: [CommonModule, RouterModule, FontAwesomeModule],
})
export class BannerComponent {
  @Input() movie: any;

  constructor(private router: Router) { }

  get backdropUrl(): string {
    return this.movie ? `https://image.tmdb.org/t/p/original${this.movie.backdrop_path}` : '';
  }

  goToDetail() {
    if (!this.movie) return;
    this.router.navigate(['/movie', this.movie.id]);
  }
}
