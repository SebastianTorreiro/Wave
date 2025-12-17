import { Controller, Post, Get } from '@nestjs/common';
import { DbseedService } from './dbseed.service';

@Controller('dbseed')
export class DbseedController {
  constructor(private readonly dbseedService: DbseedService) {}

  @Post('init')
  async seedAll() {
    return Promise.all([
      this.dbseedService.addMovieGenres(),
      this.dbseedService.addSerieGenres(),
      this.dbseedService.addAnimeGenres(),
      this.dbseedService.addVideogameGenres(),
      this.dbseedService.addMusicGenres(),
    ]);
  }
  @Get('listMovies')
  async getMovieGenres() {
    const belongsTo = 'Películas';
    return this.dbseedService.findByBelongsTo(belongsTo);
  }

  @Get('listSeries')
  async getSerieGenres() {
    const belongsTo = 'Series';
    return this.dbseedService.findByBelongsTo(belongsTo);
  }

  @Get('listAnimes')
  async getAnimeGenres() {
    const belongsTo = 'Animes';
    return this.dbseedService.findByBelongsTo(belongsTo);
  }
  @Get('listVideogames')
  async getVideogameGenres() {
    const belongsTo = 'Videojuegos';
    return this.dbseedService.findByBelongsTo(belongsTo);
  }

  @Get('listMusic')
  async getMusicGenres() {
    const belongsTo = 'Música';
    return this.dbseedService.findByBelongsTo(belongsTo);
  }
}
