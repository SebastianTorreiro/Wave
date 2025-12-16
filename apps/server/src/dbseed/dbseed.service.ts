import { Injectable } from '@nestjs/common';
import { Genres } from '@dto';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { GenresService } from './entities/genres.service';

@Injectable()
export class DbseedService {
  constructor(
    private readonly httpService: HttpService,
    private readonly genresService: GenresService
  ) {}

  async addMovieGenres(): Promise<Genres> {
    const api = 'https://api.themoviedb.org/3/genre/movie/list';
    const apiKey = 'a0e1f02b394263b862d094dbc96d422c';
    const { data } = await firstValueFrom(
      this.httpService
        .get<{ genres: { name: string }[] }>(
          `${api}?language=en&api_key=${apiKey}`
        )
        .pipe(
          catchError((error) => {
            console.log(error.response.data);
            throw 'An error happened retrieving movies genres!';
          })
        )
    );
    const transformedData = data.genres.map((genre) => genre.name);
    const genres = { belongsTo: 'Películas', genres: transformedData };
    try {
      const response = await this.genresService.findByBelongsTo(
        genres.belongsTo
      );
      if (response) {
        return response;
      }
      await this.genresService.saveGenres(genres);
      console.log('Genres saved successfully');
    } catch (error) {
      console.log('Error saving genres', error);
    }
    return genres;
  }

  async addSerieGenres(): Promise<Genres> {
    const api = 'https://api.themoviedb.org/3/genre/tv/list';
    const apiKey = 'a0e1f02b394263b862d094dbc96d422c';
    const { data } = await firstValueFrom(
      this.httpService
        .get<{ genres: { name: string }[] }>(
          `${api}?language=es&api_key=${apiKey}`
        )
        .pipe(
          catchError((error) => {
            console.log(error.response.data);
            throw 'An error happened retrieving series genres!';
          })
        )
    );
    const transformedData = data.genres.map((genre) => genre.name);
    const genres = { belongsTo: 'Series', genres: transformedData };
    try {
      const response = await this.genresService.findByBelongsTo(
        genres.belongsTo
      );
      if (response) {
        return response;
      }
      await this.genresService.saveGenres(genres);
      console.log('Genres saved successfully');
    } catch (error) {
      console.log('Error saving genres', error);
    }
    return genres;
  }

  async addAnimeGenres(): Promise<Genres> {
    const api = 'https://api.jikan.moe/v4/genres/anime';
    const { data } = await firstValueFrom(
      this.httpService.get<any>(`${api}`).pipe(
        catchError((error) => {
          console.log(error.response.data);
          throw 'An error happened retrieving animes genres!';
        })
      )
    );
    const transformedData = data.data.map((genre: any) => genre.name);
    const genres = { belongsTo: 'Animes', genres: transformedData };
    try {
      const response = await this.genresService.findByBelongsTo(
        genres.belongsTo
      );
      if (response) {
        return response;
      }
      await this.genresService.saveGenres(genres);
      console.log('Genres saved successfully');
    } catch (error) {
      console.log('Error saving genres', error);
    }
    return genres;
  }

  async addVideogameGenres(): Promise<Genres> {
    const api = 'https://api.rawg.io/api/genres';
    const apiKey = '5a56a1e8a66e4d69859ab6849a755615';
    const { data } = await firstValueFrom(
      this.httpService
        .get<{ results: { name: string }[] }>(`${api}?key=${apiKey}`)
        .pipe(
          catchError((error) => {
            console.log(error.response.data);
            throw 'An error happened retrieving videogame genres!';
          })
        )
    );
    const transformedData = data.results.map((genre) => genre.name);
    const genres = { belongsTo: 'Videojuegos', genres: transformedData };
    try {
      const response = await this.genresService.findByBelongsTo(
        genres.belongsTo
      );
      if (response) {
        return response;
      }
      await this.genresService.saveGenres(genres);
      console.log('Genres saved successfully');
    } catch (error) {
      console.log('Error saving genres', error);
    }
    return genres;
  }

  async addMusicGenres(): Promise<Genres> {
    const api = 'https://api.themoviedb.org/3/genre/movie/list';
    const apiKey = 'a0e1f02b394263b862d094dbc96d422c';
    const { data } = await firstValueFrom(
      this.httpService
        .get<{ genres: { name: string }[] }>(
          `${api}?language=es&api_key=${apiKey}`
        )
        .pipe(
          catchError((error) => {
            console.log(error.response.data);
            throw 'An error happened retrieving music genres!';
          })
        )
    );
    const transformedData = data.genres.map((genre) => genre.name);
    const genres = { belongsTo: 'Música', genres: transformedData };
    try {
      const response = await this.genresService.findByBelongsTo(
        genres.belongsTo
      );
      if (response) {
        return response;
      }
      await this.genresService.saveGenres(genres);
      console.log('Genres saved successfully');
    } catch (error) {
      console.log('Error saving genres', error);
    }
    return genres;
  }

  async findByBelongsTo(category: string): Promise<Genres | null> {
    return this.genresService.findByBelongsTo(category);
  }
}
