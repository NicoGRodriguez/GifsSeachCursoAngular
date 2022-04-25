import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SearchGifsResponse, Gif } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {
  private apiKey: string = 'CtbSNZMFPFlbWl1x5KQjtqPOHnE1ema5';
  private servicioUrl: string = 'http://api.giphy.com/v1/gifs';
  private _historia: string[] = [];

  public resultado: Gif[] = [];

  get historial() {
    return [...this._historia]
  }
  constructor(private http: HttpClient) {
    this._historia = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultado = JSON.parse(localStorage.getItem('resultado')!) || [];
  }
  buscarGifs(query: string = '') {
    query = query.trim().toLocaleLowerCase();
    if (!this._historia.includes(query)) {
      this._historia.unshift(query);
      this._historia = this._historia.splice(0, 10);
      localStorage.setItem('historial', JSON.stringify(this._historia));
    }
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', query)
    this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search`, { params })
      .subscribe((resp) => {
        this.resultado = resp.data;
        localStorage.setItem('resultado', JSON.stringify(this.resultado));
      });
  }
}
