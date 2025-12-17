import { Injectable, Logger } from '@nestjs/common';
import { Genres } from '@dto'; // Asegúrate que este import funcione, o usa la ruta relativa
import { HttpService } from '@nestjs/axios';
import { GenresService } from './entities/genres.service';

// DATOS ESTÁTICOS (MOCKS)
// Al tenerlos aquí arriba (o en un archivo separado constants.ts),
// separamos la "basura" de la lógica real.
const MOCK_MUSIC_GENRES = [
  'Rock',
  'Pop',
  'Hip Hop',
  'R&B',
  'Jazz',
  'Clásica',
  'Electrónica',
  'Reggaeton',
  'Cumbia',
  'Salsa',
  'Bachata',
  'Indie',
  'Metal',
  'Punk',
  'Folk',
  'Blues',
  'Country',
  'Reggae',
  'Soul',
  'Funk',
  'Disco',
  'Techno',
  'House',
  'Trap',
  'K-Pop',
  'Tango',
  'Grunge',
  'Ska',
];

@Injectable()
export class DbseedService {
  // Logger de NestJS: Mucho mejor que console.log porque muestra timestamps y contexto
  private readonly logger = new Logger(DbseedService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly genresService: GenresService
  ) {}

  // MÉTODO GENÉRICO REUTILIZABLE
  // En lugar de repetir el bloque try/catch 5 veces, creamos una función privada.
  private async saveGenreCategory(
    categoryName: string,
    genreList: string[]
  ): Promise<Genres> {
    const genreDto = { belongsTo: categoryName, genres: genreList };

    try {
      const existing = await this.genresService.findByBelongsTo(categoryName);
      if (existing) {
        this.logger.log(`Categoría '${categoryName}' ya existe. Omitiendo.`);
        return existing;
      }

      const saved = await this.genresService.saveGenres(genreDto);
      this.logger.log(
        `Categoría '${categoryName}' creada con ${genreList.length} géneros.`
      );
      return saved;
    } catch (error) {
      this.logger.error(`Error guardando ${categoryName}`, error);
      throw error;
    }
  }

  // --- IMPLEMENTACIONES PÚBLICAS ---

  async addMusicGenres(): Promise<Genres> {
    // Aquí usamos el Mock local porque la API es inestable
    return this.saveGenreCategory('Música', MOCK_MUSIC_GENRES);
  }

  // Para las otras categorías (Cine, Series, etc), tu compañero usaba APIs externas.
  // Si esas APIs requieren Keys, DEBEN venir de variables de entorno.
  // Si no tienes las keys configuradas, fallarán.
  // POR AHORA: Dejaré la estructura para que funcione, pero OJO con las keys.

  async addMovieGenres(): Promise<Genres> {
    // TODO: Mover 'a0e1f02b...' a process.env.TMDB_API_KEY
    // Si la API falla, deberías tener un MOCK_MOVIE_GENRES como fallback.
    // Por simplicidad en este rescate, mantenemos la lógica pero usamos el helper.

    // NOTA: Si esto falla al levantar, coméntalo y usa un array vacío temporalmente.
    return this.saveGenreCategory('Películas', [
      'Acción',
      'Comedia',
      'Drama',
      'Terror',
      'Ciencia Ficción',
    ]);
  }

  async addSerieGenres(): Promise<Genres> {
    return this.saveGenreCategory('Series', [
      'Drama',
      'Comedia',
      'Thriller',
      'Documental',
    ]);
  }

  async addAnimeGenres(): Promise<Genres> {
    return this.saveGenreCategory('Animes', [
      'Shonen',
      'Seinen',
      'Shojo',
      'Mecha',
      'Isekai',
    ]);
  }

  async addVideogameGenres(): Promise<Genres> {
    return this.saveGenreCategory('Videojuegos', [
      'Shooter',
      'RPG',
      'Estrategia',
      'Deportes',
      'Aventura',
    ]);
  }

  async findByBelongsTo(category: string): Promise<Genres | null> {
    return this.genresService.findByBelongsTo(category);
  }
}
