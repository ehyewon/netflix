import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { URLService } from '../../util/movie/URL';
import { Router } from '@angular/router';

@Component({
    selector: 'app-movie-detail',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './movie-detail.component.html',
    styleUrls: ['./movie-detail.component.css'],
})
export class MovieDetailComponent implements OnInit {

    movie: any = null;

    constructor(
        private route: ActivatedRoute,
        private urlService: URLService,
        private router: Router
    ) { }

    async ngOnInit() {
        const movieId = this.route.snapshot.paramMap.get('id');
        if (movieId) {
            this.movie = await this.urlService.getMovieDetail(Number(movieId));
        }
    }

    goBack() {
        window.history.back();
    }

    getImage(path: string) {
        return `https://image.tmdb.org/t/p/original${path}`;
    }
}
