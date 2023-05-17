import { Component, Input } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
} from "@angular/common/http";
import { environment } from 'src/environments/environment';

@Component({
  selector: "hello",
  template: `
    <h1>Hello {{ name }}!</h1>
    <button type="button" (click)="clicar()">click base</button>
    <button type="button" (click)="clicarA()">click A</button>
    <button type="button" (click)="clicarAB()">click AB</button>
    <button type="button" (click)="clicarB()">click B</button>
    <button type="button" (click)="clicarBA()">click BA</button>
  `,

  styles: [
    `
      h1 {
        font-family: Lato;
      }
    `,
  ],
})
export class HelloComponent {
  @Input() name = " ";
  readonly apiURL!: string;
  readonly apiURLA!: string;
  readonly apiURLB!: string;

  constructor(private readonly httpClient: HttpClient) {
    this.apiURL = environment.URL_Service_Base;
    this.apiURLA = environment.URL_Service_A;
    this.apiURLB = environment.URL_Service_B;
  }

  clicar() {
    const headers = new HttpHeaders({ "x-client-cert": "cert" });
    this.httpClient.get(this.apiURL, { headers }).subscribe((res) => console.log(res));

    console.log(this.name);
    console.log("Testing logs...");
  }

  async clicarA() {
    var response = await this.httpClient.get(this.apiURLA).toPromise();
    console.log(response);

    console.log(this.name);
    console.log("Testing logs...");
  }

  clicarAB() {
    const headers = new HttpHeaders({ "x-client-cert": "cert" });
    this.httpClient.get(`${this.apiURLA}B`, { headers }).subscribe((res) =>
      console.log(res)
    );

    console.log(this.name);
    console.log("Testing logs...");
  }

  clicarB() {
    const headers = new HttpHeaders({ "x-client-cert": "cert" });
    this.httpClient.get(this.apiURLB, { headers }).subscribe((res) => console.log(res));

    console.log(this.name);
    console.log("Testing logs...");
  }

  clicarBA() {
    const headers = new HttpHeaders({ "x-client-cert": "cert" });
    this.httpClient.get(`${this.apiURLB}A`, { headers }).subscribe((res) =>
      console.log(res)
    );

    console.log(this.name);
    console.log("Testing logs...");
  }
}
