import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  pokemons = <any>[]
  private urlPokemon = 'https://pokeapi.co/api/v2/pokemon/';
  private urlFormPokemon = 'https://pokeapi.co/api/v2/pokemon-form'

  constructor(private httpService: HttpClient) { }

  ngOnInit(): void {
    // Captura dos dados da API onde ira trazer todos pokemons
    this.retornaListaPokemon().subscribe(response => {
      const retornoAPI = response['body']['results']

      // Captura da API onde ira trazer os dados de cada pokemon retornado e criar um novo array pra armazenar pokemon e dados do pokemon
      for (let i = 0; i < retornoAPI.length; i++) {
        this.retornaPokemon(retornoAPI[i].name).subscribe(response => {
          this.pokemons.push(response['body'])

          // ordenando os pokemons para garantir que o id 1 é referente ao primeiro pokemon retornado na primeira lista
          this.pokemons.sort(function (a: any, b: any) {
            return a.id - b.id
          });
        });
      }
    });
  }

  retornaListaPokemon() {
    return this.get<any>(this.urlPokemon);
  }

  retornaPokemon(id: string) {
    return this.get<any>(`${this.urlFormPokemon}/${id}`)
  }

  retornaHeader() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      observe: 'response' as 'response',
    };
    return httpOptions;
  }

  get<T>(url: string): Observable<HttpResponse<T>> {
    return this.httpService.get<T>(url, this.retornaHeader());
  }
}